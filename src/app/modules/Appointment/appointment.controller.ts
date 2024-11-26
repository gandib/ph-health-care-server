import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { appointmentServices } from "./appointment.service";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "../../interfaces/pagination";

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

export const appointmentControllers = {
  createAppointment,
};
