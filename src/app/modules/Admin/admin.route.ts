import { adminValidations } from "./admin.validation";
import express from "express";
import { adminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.getAllAdmin
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.getAdminById
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateAdmin
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.deleteAdmin
);

router.delete(
  "/soft-delete/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminControllers.softDeleteAdmin
);

export const adminRoutes = router;
