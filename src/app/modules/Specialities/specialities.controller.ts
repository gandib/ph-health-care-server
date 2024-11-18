import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { specialitiesServices } from "./specialities.service";

const createSpecialities = catchAsync(async (req, res) => {
  const result = await specialitiesServices.createSpecialities(
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialities created successfully!",
    data: result,
  });
});

const getSpecialities = catchAsync(async (req, res) => {
  const result = await specialitiesServices.getSpecialities();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialities retrieved successfully!",
    data: result,
  });
});

const deleteSpecialitiesById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await specialitiesServices.deleteSpecialities(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialities deleted successfully!",
    data: result,
  });
});

export const specialitiesControllers = {
  createSpecialities,
  getSpecialities,
  deleteSpecialitiesById,
};
