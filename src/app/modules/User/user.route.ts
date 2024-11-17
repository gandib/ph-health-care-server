import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../../../utils/upload";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userControllers.getAllUser
);

router.post(
  "/create-admin",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(userValidations.createAdminValidationSchema),
  userControllers.createAdmin
);

router.post(
  "/create-doctor",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(userValidations.createDoctorValidationSchema),
  userControllers.createDoctor
);

router.post(
  "/create-patient",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidations.createPatientValidationSchema),
  userControllers.createPatient
);

router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(userValidations.updateUserValidationSchema),
  userControllers.changeProfileStatus
);

export const userRoutes = router;
