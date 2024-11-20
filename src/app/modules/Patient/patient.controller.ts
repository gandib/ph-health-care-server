import { NextFunction, Request, RequestHandler, Response } from "express";
import { patientServices } from "./patient.service";
import pick from "../../../utils/pick";
import { patientFilterAbleFields } from "./patient.constant";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

const getAllPatient = catchAsync(async (req, res) => {
  const filters = pick(req.query, patientFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await patientServices.getAllPatient(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patients retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getPatientById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientServices.getPatientById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient retrieved successfully!",
    data: result,
  });
});

const updatePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientServices.updatePatient(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient updated successfully!",
    data: result,
  });
});

const deletePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientServices.deletePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully!",
    data: result,
  });
});

const softDeletePatient = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await patientServices.softDeletePatient(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Patient deleted successfully!",
    data: result,
  });
});

export const patientControllers = {
  getAllPatient,
  getPatientById,
  updatePatient,
  deletePatient,
  softDeletePatient,
};
