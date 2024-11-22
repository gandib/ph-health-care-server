import { addHours, addMinutes, format, interval } from "date-fns";
import prisma from "../../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Schedule } from "@prisma/client";

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

export const scheduleServices = {
  createSchedule,
};
