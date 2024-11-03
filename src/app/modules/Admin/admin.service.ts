import { paginationHelpers } from "./../../../helper/paginationHelpers";
import { Prisma } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import prisma from "../../../shared/prisma";

const getAllAdmin = async (
  query: Record<string, any>,
  options: Record<string, any>
) => {
  const { searchTerm, ...fieldsData } = query;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
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
          equals: fieldsData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
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
  });

  return result;
};

export const adminServices = {
  getAllAdmin,
};
