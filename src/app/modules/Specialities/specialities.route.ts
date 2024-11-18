import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { specialitiesControllers } from "./specialities.controller";
import validateRequest from "../../middlewares/validateRequest";
import { specialitiesValidations } from "./specialities.validation";
import { upload } from "../../../utils/upload";

const router = express.Router();

router.get("/", specialitiesControllers.getSpecialities);

router.delete("/:id", specialitiesControllers.deleteSpecialitiesById);

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(specialitiesValidations.createSpecialitiesValidationSchema),
  specialitiesControllers.createSpecialities
);

export const specialitiesRoutes = router;
