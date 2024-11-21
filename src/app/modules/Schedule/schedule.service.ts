import { addHours, addMinutes, format } from "date-fns";

const createSchedule = async (payload: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}) => {
  const { startDate, endDate, startTime, endTime } = payload;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const currentDateTime = `${startDate}T${startTime}:00.000Z`;
  const startDateTime2 = new Date(currentDateTime);
  const lastDateTime = `${endDate}T${endTime}:00.000Z`;
  const endDateTime2 = new Date(lastDateTime);
  console.log(startDateTime2, endDateTime2);

  //   while (currentDate <= lastDate) {
  //     const startDateTime = new Date(
  //       addHours(
  //         `${format(currentDate, "yyyy-MM-dd")}`,
  //         Number(startTime.split(":")[0])
  //       )
  //     );

  //     const endDateTime = new Date(
  //       addHours(
  //         `${format(lastDate, "yyyy-MM-dd")}`,
  //         Number(endTime.split(":")[0])
  //       )
  //     );
  //     console.log(startDateTime, endDateTime);
  //   }
};

export const scheduleServices = {
  createSchedule,
};
