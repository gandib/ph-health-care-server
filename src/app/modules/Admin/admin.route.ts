import { adminValidations } from "./admin.validation";
import express from "express";
import { adminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", adminControllers.getAllAdmin);

router.get("/:id", adminControllers.getAdminById);

router.patch(
  "/:id",
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateAdmin
);

router.delete("/:id", adminControllers.deleteAdmin);

router.delete("/soft-delete/:id", adminControllers.softDeleteAdmin);

export const adminRoutes = router;
