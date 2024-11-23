import express from "express";
import { doctorScheduleControllers } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.getAllSchedules
);

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.getMySchedules
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.createDoctorSchedule
);

router.delete(
  "/:id",
  auth(UserRole.DOCTOR),
  doctorScheduleControllers.deleteMySchedule
);

export const doctorScheduleRoutes = router;
