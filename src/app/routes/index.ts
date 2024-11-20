import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { specialitiesRoutes } from "../modules/Specialities/specialities.route";
import { doctorRoutes } from "../modules/Doctor/doctor.route";
import { patientRoutes } from "../modules/Patient/patient.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
