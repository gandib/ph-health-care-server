import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { specialitiesRoutes } from "../modules/Specialities/specialities.route";
import { doctorRoutes } from "../modules/Doctor/doctor.route";
import { patientRoutes } from "../modules/Patient/patient.route";
import { scheduleRoutes } from "../modules/Schedule/schedule.routes";
import { doctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.routes";
import { appointmentRoutes } from "../modules/Appointment/appointment.route";
import { paymentRoutes } from "../modules/Payment/payment.route";
import { prescriptionRoutes } from "../modules/Prescription/prescription.route";
import { reviewRoutes } from "../modules/Review/review.route";
import { metaRoutes } from "../modules/Meta/meta.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/specialities",
    route: specialitiesRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoutes,
  },
  {
    path: "/appointment",
    route: appointmentRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/prescription",
    route: prescriptionRoutes,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
  {
    path: "/meta",
    route: metaRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
