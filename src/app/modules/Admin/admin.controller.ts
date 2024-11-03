import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";

const getAllAdmin = async (req: Request, res: Response) => {
  const filters = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  try {
    const result = await adminServices.getAllAdmin(filters, options);

    res.status(200).json({
      success: true,
      message: "Admins retrieved successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong!",
      error,
    });
  }
};

export const adminControllers = {
  getAllAdmin,
};
