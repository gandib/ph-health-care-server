import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { scheduleServices } from "./schedule.service";
import { scheduleFilterAbleFields } from "./schedule.constant";
import pick from "../../../utils/pick";
import { JwtPayload } from "jsonwebtoken";

const createSchedule = catchAsync(async (req, res) => {
  const result = await scheduleServices.createSchedule(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const filters = pick(req.query, scheduleFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await scheduleServices.getAllSchedules(
    filters,
    options,
    req.user as JwtPayload & { email: string; role: string }
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedules retrieved successfully!",
    data: result,
  });
});

const getScheduleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await scheduleServices.getScheduleById(
    req.user as JwtPayload & { email: string; role: string },
    id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule retrieved successfully!",
    data: result,
  });
});

const deleteScheduleById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await scheduleServices.deleteScheduleById(
    req.user as JwtPayload & { email: string; role: string },
    id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule deleted successfully!",
    data: result,
  });
});

export const scheduleControllers = {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  deleteScheduleById,
};
