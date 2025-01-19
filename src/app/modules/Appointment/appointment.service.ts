import { JwtPayload } from "jsonwebtoken";
import { TPaginationOptions, TUser } from "../../interfaces/pagination";
import prisma from "../../../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import { TAppointmentFilterRequest } from "./appointment.interface";
import { paginationHelpers } from "../../../helper/paginationHelpers";
import { AppointmentStatus, Prisma } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createAppointment = async (
  user: JwtPayload & TUser,
  payload: { doctorId: string; scheduleId: string }
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId: string = uuidv4();

  const result = await prisma.$transaction(async (transactionClient) => {
    const appointmentData = await transactionClient.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
        payment: true,
      },
    });

    await transactionClient.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    const today = new Date();
    const transactionId = `PH-HealthCare-${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}-${Date.now()}`;

    await transactionClient.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

const getMyAppointment = async (
  user: TUser,
  filters: TAppointmentFilterRequest,
  options: TPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { ...filterData } = filters;
  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === "PATIENT") {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  } else if (user?.role === "DOCTOR") {
    andConditions.push({
      doctor: {
        email: user?.email,
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput = { AND: andConditions };

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include:
      user?.role === "PATIENT"
        ? {
            doctor: true,
            schedule: true,
            payment: true,
          }
        : {
            patient: {
              include: {
                medicalReport: true,
                patientHealthData: true,
              },
            },
            schedule: true,
            payment: true,
          },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllAppointment = async (
  filters: TAppointmentFilterRequest,
  options: TPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const { ...filterData } = filters;
  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput = { AND: andConditions };

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      doctor: true,
      patient: {
        include: {
          medicalReport: true,
          patientHealthData: true,
        },
      },
      schedule: true,
      doctorSchedule: true,
      payment: true,
    },
  });

  const total = await prisma.appointment.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeAppointmentStatus = async (
  id: string,
  payload: { status: AppointmentStatus },
  user: TUser
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      doctor: true,
    },
  });

  if (user.role === "DOCTOR" && user.email !== appointmentData?.doctor?.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment!");
  }

  const result = await prisma.appointment.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
  });

  return result;
};

const cancelUnpaidAppointments = async () => {
  const thirtyMinAgo = new Date(Date.now() - 1 * 60 * 1000);

  const unPaidAppointments = await prisma.appointment.findMany({
    where: {
      createdAt: {
        lte: thirtyMinAgo,
      },
      paymentStatus: "UNPAID",
    },
  });

  const appointmentIdsToCancel = unPaidAppointments.map(
    (appointment) => appointment.id
  );

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
    });

    await tx.doctorSchedule.updateMany({
      where: {
        appointmentId: {
          in: appointmentIdsToCancel,
        },
      },
      data: {
        isBooked: false,
        appointmentId: null,
      },
    });

    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIdsToCancel,
        },
      },
    });
  });

  // console.log(appointmentIdsToCancel);
};

export const appointmentServices = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
  changeAppointmentStatus,
  cancelUnpaidAppointments,
};
