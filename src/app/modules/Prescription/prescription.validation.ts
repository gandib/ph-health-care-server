import { z } from "zod";

const createPrescriptionValidationSchema = z.object({
  body: z.object({
    appointmentId: z.string({ required_error: "Appointment id is required!" }),
    instructions: z.string({ required_error: "Instructions is required!" }),
    followUpDate: z.string().optional(),
  }),
});

export const prescriptionValidations = {
  createPrescriptionValidationSchema,
};
