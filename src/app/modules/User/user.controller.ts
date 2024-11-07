import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

const createAdmin = catchAsync(async (req, res) => {
  const result = await userServices.createAdmin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins created successfully!",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
};
