import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { appointmentServices } from "./appointment.service";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "../../interfaces/pagination";
import pick from "../../../utils/pick";

const createAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await appointmentServices.createAppointment(
    user as JwtPayload & TUser,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment booked successfully!",
    data: result,
  });
});

const getMyAppointment = catchAsync(async (req, res) => {
  const user = req.user;
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await appointmentServices.getMyAppointment(
    user as JwtPayload & TUser,
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My appointment retrieved successfully!",
    data: result,
  });
});

const getAllAppointment = catchAsync(async (req, res) => {
  const filters = pick(req.query, ["status", "paymentStatus"]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await appointmentServices.getAllAppointment(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All appointments retrieved successfully!",
    data: result,
  });
});

export const appointmentControllers = {
  createAppointment,
  getMyAppointment,
  getAllAppointment,
};
