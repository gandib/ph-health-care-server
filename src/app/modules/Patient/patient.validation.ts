import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";
import { z } from "zod";

const updatePatientValidationSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      contactNumber: z.string().optional(),
      address: z.string().optional(),
      patientHealthData: z
        .object({
          dateOfBirth: z.string().optional(),
          gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
          bloodGroup: z
            .enum([
              BloodGroup.A_POSITIVE,
              BloodGroup.A_NEGATIVE,
              BloodGroup.B_POSITIVE,
              BloodGroup.B_NEGATIVE,
              BloodGroup.O_POSITIVE,
              BloodGroup.O_NEGATIVE,
              BloodGroup.AB_POSITIVE,
              BloodGroup.AB_NEGATIVE,
            ])
            .optional(),
          hasAllergies: z.boolean().optional(),
          hasDiabetes: z.boolean().optional(),
          height: z.string().optional(),
          weight: z.string().optional(),
          smokingStatus: z.boolean().optional(),
          dietaryPreferences: z.string().optional(),
          pregnancyStatus: z.boolean().optional(),
          mentalHealthHistory: z.string().optional(),
          immunizationStatus: z.string().optional(),
          hasPastSurgeries: z.boolean().optional(),
          recentAnxiety: z.boolean().optional(),
          recentDepression: z.boolean().optional(),
          maritalStatus: z
            .enum([MaritalStatus.MARRIED, MaritalStatus.UNMARRIED])
            .optional(),
        })
        .strict()
        .optional(),
      medicalReport: z
        .object({
          reportName: z.string({ required_error: "Report name is required!" }),
          reportLink: z.string({ required_error: "Report link is required!" }),
        })
        .strict()
        .optional(),
    })
    .strict(),
});

export const patientValidations = {
  updatePatientValidationSchema,
};
