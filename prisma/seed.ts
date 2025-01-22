import bcrypt from "bcrypt";
import prisma from "../src/utils/prisma";

const seedSuperAdmin = async () => {
  try {
    const isExistsSuperAdmin = await prisma.user.findFirst({
      where: {
        role: "SUPER_ADMIN",
      },
    });

    if (isExistsSuperAdmin) {
      console.log("Super admin is already exists!");
      return;
    }
    const hashedPassword = await bcrypt.hash("superadmin", 12);
    const superAdminData = await prisma.user.create({
      data: {
        email: "super@admin.com",
        role: "SUPER_ADMIN",
        password: hashedPassword,
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "01234567890",
          },
        },
      },
    });
    console.log("Super admin created successfully", superAdminData);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
