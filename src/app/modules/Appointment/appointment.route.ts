import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { appointmentControllers } from "./appointment.controller";
import express from "express";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.PATIENT),
  appointmentControllers.createAppointment
);

export const appointmentRoutes = router;
