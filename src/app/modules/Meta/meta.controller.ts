import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { metaServices } from "./meta.service";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "../../interfaces/pagination";

const getDashboardMetaData = catchAsync(async (req, res) => {
  const result = await metaServices.getDashboardMetaData(
    req.user as JwtPayload & TUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard meta data retrieved successfully!",
    data: result,
  });
});

export const metaControllers = {
  getDashboardMetaData,
};
