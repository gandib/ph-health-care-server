import { Prescription, Review } from "@prisma/client";
import { TPaginationOptions, TUser } from "../../interfaces/pagination";
import prisma from "../../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { paginationHelpers } from "../../../helper/paginationHelpers";

const createReview = async (payload: Partial<Review>, user: TUser) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      paymentStatus: "PAID",
      status: "COMPLETED",
    },
    include: {
      patient: true,
    },
  });

  if (appointmentData.patient.email !== user.email) {
    throw new AppError(httpStatus.BAD_REQUEST, "This is not your appointment!");
  }

  return await prisma.$transaction(async (tx) => {
    const result = await tx.review.create({
      data: {
        appointmentId: appointmentData.id,
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        rating: payload.rating!,
        comment: payload.comment!,
      },
      include: {
        doctor: true,
      },
    });

    const averageRating = await tx.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    await tx.doctor.update({
      where: {
        id: result.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });
    return result;
  });
};

const allReview = async (user: TUser, options: TPaginationOptions) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const result = await prisma.review.findMany({
    include: {
      doctor: true,
      appointment: true,
      patient: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.review.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

export const reviewServices = {
  createReview,
  allReview,
};
