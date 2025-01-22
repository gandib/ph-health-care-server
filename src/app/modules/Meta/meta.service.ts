import prisma from "../../../utils/prisma";
import { TUser } from "../../interfaces/pagination";

const getDashboardMetaData = async (user: TUser) => {
  let metaData;
  switch (user?.role) {
    case "SUPER_ADMIN":
      metaData = getSuperAdminMetaData();
      break;
    case "ADMIN":
      metaData = getAdminMetaData();
      break;
    case "DOCTOR":
      metaData = getDoctorMetaData(user);
      break;
    case "PATIENT":
      metaData = getPatientMetaData(user);
      break;
    default:
      throw new Error("Invalid user role!");
  }

  return metaData;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "PAID",
    },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    adminCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount,
    barChartData,
    pieChartData,
  };
};

const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "PAID",
    },
  });

  const barChartData = await getBarChartData();
  const pieChartData = await getPieChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue: totalRevenue._sum.amount,
    barChartData,
    pieChartData,
  };
};

const getDoctorMetaData = async (user: TUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    where: {
      doctorId: doctorData.id,
    },
    _count: { id: true },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: "PAID",
    },
  });

  const unformattedAppointmentStatusDistribution =
    await prisma.appointment.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
      where: {
        doctorId: doctorData.id,
      },
    });

  const appointmentStatusDistribution =
    unformattedAppointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue: totalRevenue._sum.amount,
    appointmentStatusDistribution,
  };
};

const getPatientMetaData = async (user: TUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const unformattedAppointmentStatusDistribution =
    await prisma.appointment.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
      where: {
        patientId: patientData.id,
      },
    });

  const appointmentStatusDistribution =
    unformattedAppointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    appointmentStatusDistribution,
  };
};

const getBarChartData = async () => {
  const appointmentCountByMonth: { month: Date; count: BigInt }[] =
    await prisma.$queryRaw`
  SELECT DATE_TRUNC('month', "createdAt") AS month,
  CAST(COUNT(*) AS INTEGER) AS count 
  FROM "appointments"
  GROUP BY month
  ORDER BY month ASC
  `;

  return appointmentCountByMonth;
};

const getPieChartData = async () => {
  const unformattedAppointmentStatusDistribution =
    await prisma.appointment.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

  const appointmentStatusDistribution =
    unformattedAppointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return appointmentStatusDistribution;
};

export const metaServices = {
  getDashboardMetaData,
};
