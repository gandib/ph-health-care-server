import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { userFilterAbleFields } from "./user.constant";
import pick from "../../../utils/pick";
import { UserRole } from "@prisma/client";

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
  const result = await userServices.createDoctor(req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});

const createPatient = catchAsync(async (req, res) => {
  const result = await userServices.createPatient(req.file, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await userServices.getAllUser(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile status updated successfully!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await userServices.getMyProfile(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile data retrieved successfully!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await userServices.updateMyProfile(
    req.user as JwtPayload & { email: string; role: UserRole },
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile data updated successfully!",
    data: result,
  });
});

export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
