import { Specialities } from "@prisma/client";
import { sendImageToCloudinary } from "../../../utils/sendImageToCloudinary";
import prisma from "../../../utils/prisma";

const createSpecialities = async (payload: Specialities, file: any) => {
  if (file) {
    const imageName = `${payload?.title}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}`;
    const path = file?.path;

    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    payload.icon = secure_url as string;
  }

  const result = await prisma.specialities.create({
    data: payload,
  });

  return result;
};

const getSpecialities = async () => {
  const result = await prisma.specialities.findMany();
  return result;
};

const deleteSpecialities = async (id: string) => {
  const result = await prisma.specialities.delete({
    where: {
      id,
    },
  });
  return result;
};

export const specialitiesServices = {
  createSpecialities,
  getSpecialities,
  deleteSpecialities,
};
