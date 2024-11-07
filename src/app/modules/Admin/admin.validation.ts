import { z } from "zod";

const updateAdminValidationSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      contactNumber: z.string().optional(),
    })
    .strict(),
});

export const adminValidations = {
  updateAdminValidationSchema,
};
