import express from "express";
import { reviewControllers } from "./review.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { reviewValidations } from "./review.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  validateRequest(reviewValidations.createReviewValidationSchema),
  reviewControllers.createReview
);

router.get(
  "/all-review",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  reviewControllers.allReview
);

export const reviewRoutes = router;
