import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { reviewServices } from "./review.service";
import { JwtPayload } from "jsonwebtoken";
import { TUser } from "../../interfaces/pagination";
import pick from "../../../utils/pick";

const createReview = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await reviewServices.createReview(
    req.body,
    user as JwtPayload & TUser
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review created successfully!",
    data: result,
  });
});

const allReview = catchAsync(async (req, res) => {
  const user = req.user;
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await reviewServices.allReview(
    user as JwtPayload & TUser,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const reviewControllers = {
  createReview,
  allReview,
};
