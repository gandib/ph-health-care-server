import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

const createAdmin = catchAsync(async (req, res) => {
  const result = await userServices.createAdmin(req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const result = await userServices.createAdmin(req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
  createDoctor,
};
