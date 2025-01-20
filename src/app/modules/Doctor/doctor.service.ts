import { paginationHelpers } from "../../../helper/paginationHelpers";
import { Admin, Doctor, Prisma, Specialities } from "@prisma/client";
import prisma from "../../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TDoctorFilterRequest } from "./doctor.interface";
import { doctorSearchAbleFields } from "./doctor.constant";

const getAllDoctor = async (
  query: TDoctorFilterRequest,
  options: TPaginationOptions
) => {
  const { searchTerm, specialities, ...fieldsData } = query;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchAbleFields.map((field) => ({
        [field]: {
          contains: query?.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialities) {
    andConditions.push({
      doctorSpecialities: {
        some: {
          specialities: {
            title: {
              contains: specialities,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(fieldsData).length > 0) {
    andConditions.push({
      AND: Object.keys(fieldsData).map((key) => ({
        [key]: {
          equals: (fieldsData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            averageRating: "desc",
          },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getDoctorById = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const deleteDoctor = async (id: string): Promise<Doctor> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeletedData = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: doctorDeletedData.email,
      },
    });
    return doctorDeletedData;
  });
  return result;
};

const softDeleteDoctor = async (id: string): Promise<Doctor> => {
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const doctorDeletedData = await transactionClient.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: doctorDeletedData.email,
      },
      data: {
        status: "DELETED",
      },
    });
    return doctorDeletedData;
  });
  return result;
};

const updateDoctor = async (
  id: string,
  payload: Partial<
    Doctor & { specialities: [{ specialitiesId: string; isDeleted: boolean }] }
  >
) => {
  const { specialities, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialities && specialities.length > 0) {
      // delete specialities
      const deleteSpecialitiesIds = specialities.filter(
        (speciality) => speciality.isDeleted
      );
      for (const speciality of deleteSpecialitiesIds) {
        await transactionClient.doctorSpecialities.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: speciality.specialitiesId,
          },
        });
      }

      // create specialities
      const createSpecialitiesIds = specialities.filter(
        (speciality) => !speciality.isDeleted
      );
      for (const speciality of createSpecialitiesIds) {
        await transactionClient.doctorSpecialities.create({
          data: {
            doctorId: doctorInfo.id,
            specialitiesId: speciality.specialitiesId,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialities: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

export const doctorServices = {
  getAllDoctor,
  getDoctorById,
  deleteDoctor,
  softDeleteDoctor,
  updateDoctor,
};
