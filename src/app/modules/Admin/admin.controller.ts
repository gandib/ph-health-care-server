import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAllAdmin = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllAdmin(req.query);

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
