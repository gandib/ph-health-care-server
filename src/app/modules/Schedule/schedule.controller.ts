import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { scheduleServices } from "./schedule.service";

const createSchedule = catchAsync(async (req, res) => {
  const result = await scheduleServices.createSchedule(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

export const scheduleControllers = {
  createSchedule,
};
