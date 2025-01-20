import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { prescriptionServices } from "./prescription.service";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "../../interfaces/pagination";
import pick from "../../../utils/pick";

const createPrescription = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await prescriptionServices.createPrescription(
    req.body,
    user as JwtPayload & TUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription created successfully!",
    data: result,
  });
});

const patientPrescription = catchAsync(async (req, res) => {
  const user = req.user;
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await prescriptionServices.patientPrescription(
    user as JwtPayload & TUser,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prescription retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const prescriptionControllers = {
  createPrescription,
  patientPrescription,
};
