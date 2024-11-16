import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../utils/pick";
import { adminFilterAbleFields } from "./admin.constant";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

const getAllAdmin = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await adminServices.getAllAdmin(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admins retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.getAdminById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieved successfully!",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.updateAdmin(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin updated successfully!",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.deleteAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully!",
    data: result,
  });
});

const softDeleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminServices.softDeleteAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully!",
    data: result,
  });
});

export const adminControllers = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
