import { NextFunction, Request, RequestHandler, Response } from "express";
import pick from "../../../utils/pick";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import { doctorFilterAbleFields } from "./doctor.constant";
import { doctorServices } from "./doctor.service";

const getAllDoctor = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await doctorServices.getAllDoctor(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getDoctorById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await doctorServices.getDoctorById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor retrieved successfully!",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await doctorServices.updateDoctor(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await doctorServices.deleteDoctor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully!",
    data: result,
  });
});

const softDeleteDoctor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await doctorServices.softDeleteDoctor(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully!",
    data: result,
  });
});

export const doctorControllers = {
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  softDeleteDoctor,
};
