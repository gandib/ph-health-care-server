import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmin = async (query: Record<string, any>) => {
  const { searchTerm, ...fieldsData } = query;
  const andConditions: Prisma.AdminWhereInput[] = [];
  const adminSearchAbleFields = ["name", "email"];

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
  });

  return result;
};

export const adminServices = {
  getAllAdmin,
};
