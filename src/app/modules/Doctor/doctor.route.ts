import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorControllers } from "./doctor.controller";
import { doctorValidations } from "./doctor.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorControllers.getAllDoctor
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorControllers.getDoctorById
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  // validateRequest(doctorValidations.updateDoctorValidationSchema),
  doctorControllers.updateDoctor
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorControllers.deleteDoctor
);

router.delete(
  "/soft-delete/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  doctorControllers.softDeleteDoctor
);

export const doctorRoutes = router;
