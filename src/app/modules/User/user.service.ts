import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../utils/prisma";
import { sendImageToCloudinary } from "../../../utils/sendImageToCloudinary";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helper/paginationHelpers";
import { userSearchAbleFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";

type TUserAdmin = {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
  };
};

const createAdmin = async (
  file: any,
  payload: { password: string; admin: Admin }
) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  if (file) {
    const imageName = `${payload?.admin?.name}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
    const path = file?.path;

    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.admin.profilePhoto = secure_url as string;
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: payload.admin,
    });

    return createdAdminData;
  });

  return result;
};

const createDoctor = async (
  file: any,
  payload: { password: string; doctor: Doctor }
) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  if (file) {
    const imageName = `${payload?.doctor?.name}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
    const path = file?.path;

    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.doctor.profilePhoto = secure_url as string;
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: payload.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

const createPatient = async (
  file: any,
  payload: { password: string; patient: Patient }
) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const userData = {
    email: payload.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  if (file) {
    const imageName = `${payload?.patient?.name}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
    const path = file?.path;

    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.patient.profilePhoto = secure_url as string;
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdPatientData = await transactionClient.patient.create({
      data: payload.patient,
    });

    return createdPatientData;
  });

  return result;
};

const getAllUser = async (query: any, options: TPaginationOptions) => {
  const { searchTerm, ...fieldsData } = query;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: query?.searchTerm,
          mode: "insensitive",
        },
      })),
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
      doctor: true,
      patient: true,
      admin: true,
    },
  });

  const total = await prisma.user.count({
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

const changeProfileStatus = async (
  id: string,
  payload: { status: UserStatus }
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: payload.status,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updateUserStatus;
};

const getMyProfile = async (user: JwtPayload) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: "ACTIVE",
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });

  let profileInfo;
  if (userInfo.role === "SUPER_ADMIN" || userInfo.role === "ADMIN") {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
  } else if (userInfo.role === "DOCTOR") {
    profileInfo = await prisma.doctor.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
  } else if (userInfo.role === "PATIENT") {
    profileInfo = await prisma.patient.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const updateMyProfile = async (
  user: JwtPayload & { email: string; role: UserRole },
  payload: Partial<Admin & Doctor & Patient>,
  file: any
) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: "ACTIVE",
    },
  });

  if (file) {
    const imageName = `${payload?.name}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
    const path = file?.path;

    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.profilePhoto = secure_url as string;
  }

  let profileInfo;
  if (userInfo.role === "SUPER_ADMIN" || userInfo.role === "ADMIN") {
    profileInfo = await prisma.admin.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  } else if (userInfo.role === "DOCTOR") {
    profileInfo = await prisma.doctor.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  } else if (userInfo.role === "PATIENT") {
    profileInfo = await prisma.patient.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  }

  return profileInfo;
};

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUser,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
