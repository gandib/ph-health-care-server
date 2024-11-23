import { addHours, addMinutes, format, interval } from "date-fns";
import prisma from "../../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Prisma, Schedule } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helper/paginationHelpers";
import { TScheduleFilterRequest } from "./schedule.interface";
import { JwtPayload } from "jsonwebtoken";
import { string } from "zod";

const createSchedule = async (payload: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;
  const schedules = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);
  const intervalTime = 30;

  // const currentDateTime = `${startDate}T${startTime}:00.000Z`;
  // const startDateTime2 = new Date(currentDateTime);
  // const lastDateTime = `${endDate}T${endTime}:00.000Z`;
  // const endDateTime2 = new Date(lastDateTime);
  // console.log(startDateTime2, endDateTime2);

  if (startDate > endDate || startTime > endTime) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Start date and time should not be bigger than end date and time!"
    );
  }

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    let endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };

      const result = await prisma.schedule.create({
        data: scheduleData,
      });
      schedules.push(result);

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};

const getAllSchedules = async (
  query: TScheduleFilterRequest,
  options: TPaginationOptions,
  user: JwtPayload & { email: string; role: string }
) => {
  const { startDateTime, endDateTime, ...fieldsData } = query;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: { gte: startDateTime },
        },
        {
          endDateTime: { lte: endDateTime },
        },
      ],
    });
  }

  if (Object.keys(fieldsData).length > 0) {
    andConditions.push({
      AND: Object.keys(fieldsData).map((key) => ({
        [key]: {
          equals: (fieldsData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput = { AND: andConditions };

  const doctorSchedules = await prisma.doctorSchedule.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },
  });

  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: { notIn: doctorScheduleIds },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            startDateTime: "desc",
          },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: { notIn: doctorScheduleIds },
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

const getScheduleById = async (
  user: JwtPayload & { email: string; role: string },
  id: string
) => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user.email,
      isDeleted: false,
    },
  });

  const result = await prisma.schedule.findUniqueOrThrow({
    where: {
      id,
    },
  });

  return result;
};

const deleteScheduleById = async (
  user: JwtPayload & { email: string; role: string },
  id: string
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const scheduleData = await prisma.schedule.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      doctorSchedule: {
        include: {
          doctor: true,
        },
      },
    },
  });

  if (scheduleData?.doctorSchedule[0]?.isBooked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Schedule can not be deleted because it is already booked!"
    );
  }

  const result = await prisma.schedule.delete({
    where: {
      id,
    },
  });

  return result;
};

export const scheduleServices = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  deleteScheduleById,
};
