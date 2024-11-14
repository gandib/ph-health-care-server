import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userControllers.createAdmin
);

export const userRoutes = router;
