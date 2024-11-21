import { patientValidations } from "./patient.validation";
import express from "express";
import { patientControllers } from "./patient.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
  patientControllers.getAllPatient
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  patientControllers.getPatientById
);

router.patch(
  "/:id",
  auth(UserRole.PATIENT),
  validateRequest(patientValidations.updatePatientValidationSchema),
  patientControllers.updatePatient
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientControllers.deletePatient
);

router.delete(
  "/soft-delete/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  patientControllers.softDeletePatient
);

export const patientRoutes = router;
