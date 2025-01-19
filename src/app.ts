import { appointmentServices } from "./app/modules/Appointment/appointment.service";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandlers";
import cookieParser from "cookie-parser";
import cron from "node-cron";

const app: Application = express();

app.use(cors());
// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "PH Health Care Server" });
});

app.use("/api/v1", router);

cron.schedule("* * * * *", () => {
  try {
    appointmentServices.cancelUnpaidAppointments();
  } catch (error) {
    console.log(error);
  }
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
