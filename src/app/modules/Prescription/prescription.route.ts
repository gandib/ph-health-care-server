import express from "express";
import { prescriptionControllers } from "./prescription.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { prescriptionValidations } from "./prescription.validation";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(prescriptionValidations.createPrescriptionValidationSchema),
  prescriptionControllers.createPrescription
);

router.get(
  "/my-prescription",
  auth(UserRole.PATIENT, UserRole.SUPER_ADMIN, UserRole.ADMIN),
  prescriptionControllers.patientPrescription
);

export const prescriptionRoutes = router;
