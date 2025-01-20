import { Prescription, Prisma } from "@prisma/client";
import { TPaginationOptions, TUser } from "../../interfaces/pagination";
import prisma from "../../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { paginationHelpers } from "../../../helper/paginationHelpers";

const createPrescription = async (
  payload: Partial<Prescription>,
  user: TUser
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      paymentStatus: "PAID",
      status: "COMPLETED",
    },
    include: {
      doctor: true,
    },
  });

  if (appointmentData.doctor.email !== user.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment!");
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate,
    },
    include: {
      patient: true,
    },
  });

  return result;
};

const patientPrescription = async (
  user: TUser,
  options: TPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andConditions: Prisma.PrescriptionWhereInput[] = [];

  if (user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") {
    andConditions.push({});
  } else if (user?.role === "PATIENT") {
    andConditions.push({
      patient: {
        email: user?.email,
      },
    });
  }

  const whereConditions: Prisma.PrescriptionWhereInput = { AND: andConditions };

  const result = await prisma.prescription.findMany({
    where: whereConditions,
    include: {
      doctor: true,
      appointment: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.prescription.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const prescriptionServices = {
  createPrescription,
  patientPrescription,
};
