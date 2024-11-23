import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../utils/prisma";
import { TDoctorScheduleFilterRequest } from "./doctorSchedule.interface";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helper/paginationHelpers";
import { Prisma } from "@prisma/client";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createDoctorSchedule = async (
  user: JwtPayload & { email: string; role: string },
  payload: { scheduleIds: string[] }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedule.createManyAndReturn({
    data: doctorScheduleData,
  });
  return result;
};

const getAllSchedules = async (
  query: TDoctorScheduleFilterRequest,
  options: TPaginationOptions,
  user: JwtPayload & { email: string; role: string }
) => {
  const { startDateTime, endDateTime, ...fieldsData } = query;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: { gte: startDateTime },
          },
        },
        {
          schedule: {
            endDateTime: { lte: endDateTime },
          },
        },
      ],
    });
  }

  if (Object.keys(fieldsData).length > 0) {
    if (
      typeof fieldsData.isBooked === "string" &&
      fieldsData.isBooked === "true"
    ) {
      fieldsData.isBooked = true;
    } else if (
      typeof fieldsData.isBooked === "string" &&
      fieldsData.isBooked === "false"
    ) {
      fieldsData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(fieldsData).map((key) => ({
        [key]: {
          equals: (fieldsData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedule.findMany({
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
  });

  const total = await prisma.doctorSchedule.count({
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

const getMySchedules = async (
  query: TDoctorScheduleFilterRequest,
  options: TPaginationOptions,
  user: JwtPayload & { email: string; role: string }
) => {
  const { startDateTime, endDateTime, ...fieldsData } = query;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andConditions: Prisma.DoctorScheduleWhereInput[] = [];

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: { gte: startDateTime },
          },
        },
        {
          schedule: {
            endDateTime: { lte: endDateTime },
          },
        },
      ],
    });
  }

  if (Object.keys(fieldsData).length > 0) {
    if (
      typeof fieldsData.isBooked === "string" &&
      fieldsData.isBooked === "true"
    ) {
      fieldsData.isBooked = true;
    } else if (
      typeof fieldsData.isBooked === "string" &&
      fieldsData.isBooked === "false"
    ) {
      fieldsData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(fieldsData).map((key) => ({
        [key]: {
          equals: (fieldsData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.DoctorScheduleWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.doctorSchedule.findMany({
    where: {
      ...whereConditions,
      doctor: {
        email: user.email,
      },
    },
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
  });

  const total = await prisma.doctorSchedule.count({
    where: {
      ...whereConditions,
      doctor: {
        email: user.email,
      },
    },
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

const deleteMySchedule = async (
  user: JwtPayload & { email: string; role: string },
  scheduleId: string
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isBookedSchedule = await prisma.doctorSchedule.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId,
      },
      isBooked: true,
    },
  });

  if (isBookedSchedule) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Schedule can not be deleted because it is already booked!"
    );
  }

  const result = await prisma.doctorSchedule.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData.id,
        scheduleId,
      },
    },
  });

  return result;
};

export const doctorScheduleServices = {
  createDoctorSchedule,
  getMySchedules,
  deleteMySchedule,
  getAllSchedules,
};
