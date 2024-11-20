import { z } from "zod";

const updatePatientValidationSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      contactNumber: z.string().optional(),
    })
    .strict(),
});

export const patientValidations = {
  updatePatientValidationSchema,
};
