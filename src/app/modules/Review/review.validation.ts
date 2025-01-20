import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    appointmentId: z.string({ required_error: "Appointment id is required!" }),
    rating: z.number({ required_error: "Rating is required!" }),
    comment: z.string({ required_error: "comment is required!" }),
  }),
});

export const reviewValidations = {
  createReviewValidationSchema,
};
