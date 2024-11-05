import express from "express";
import { adminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", adminControllers.getAllAdmin);

router.get("/:id", adminControllers.getAdminById);

router.patch("/:id", adminControllers.updateAdmin);

router.delete("/:id", adminControllers.deleteAdmin);

router.delete("/soft-delete/:id", adminControllers.softDeleteAdmin);

export const adminRoutes = router;
