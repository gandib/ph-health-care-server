import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { appointmentControllers } from "./appointment.controller";
import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { appointmentValidations } from "./appointment.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  appointmentControllers.getAllAppointment
);

router.get(
  "/my-appointment",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  appointmentControllers.getMyAppointment
);

router.post(
  "/",
  auth(UserRole.PATIENT),
  validateRequest(appointmentValidations.createAppointmentValidationSchema),
  appointmentControllers.createAppointment
);

router.patch(
  "/status/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  appointmentControllers.changeAppointmentStatus
);

export const appointmentRoutes = router;
