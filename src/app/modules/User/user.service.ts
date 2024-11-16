import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../utils/prisma";
import { sendImageToCloudinary } from "../../../utils/sendImageToCloudinary";

type TUserAdmin = {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
  };
};

const createAdmin = async (file: any, payload: TUserAdmin) => {
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

const createDoctor = async (file: any, payload: TUserAdmin) => {
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

export const userServices = {
  createAdmin,
  createDoctor,
};
