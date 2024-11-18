import { z } from "zod";

const updateDoctorValidationSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      contactNumber: z.string().optional(),
    })
    .strict(),
});

export const doctorValidations = {
  updateDoctorValidationSchema,
};
