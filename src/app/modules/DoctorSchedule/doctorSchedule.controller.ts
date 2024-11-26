import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { doctorScheduleServices } from "./doctorSchedule.service";
import { JwtPayload } from "jsonwebtoken";
import pick from "../../../utils/pick";
import { doctorScheduleFilterAbleFields } from "./doctorSchedule.constant";
import { TUser } from "../../interfaces/pagination";

const createDoctorSchedule = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await doctorScheduleServices.createDoctorSchedule(
    user as JwtPayload & TUser,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor schedule created successfully!",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorScheduleFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await doctorScheduleServices.getAllSchedules(
    filters,
    options,
    req.user as JwtPayload & TUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedules retrieved successfully!",
    data: result,
  });
});

const getMySchedules = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorScheduleFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await doctorScheduleServices.getMySchedules(
    filters,
    options,
    req.user as JwtPayload & TUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My schedules retrieved successfully!",
    data: result,
  });
});

const deleteMySchedule = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await doctorScheduleServices.deleteMySchedule(
    req.user as JwtPayload & TUser,
    id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My schedule deleted successfully!",
    data: result,
  });
});

export const doctorScheduleControllers = {
  createDoctorSchedule,
  getMySchedules,
  deleteMySchedule,
  getAllSchedules,
};
