import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const filters = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  try {
    const result = await adminServices.getAllAdmin(filters, options);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admins retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await adminServices.getAdminById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin retrieved successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await adminServices.updateAdmin(id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await adminServices.deleteAdmin(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await adminServices.softDeleteAdmin(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminControllers = {
  getAllAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
