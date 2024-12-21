import axios from "axios";
import config from "../../../config";
import prisma from "../../../utils/prisma";
import { sslServices } from "../SSL/ssl.service";

const initPayment = async (appointmentId: string) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  console.log(paymentData);

  const initiatePaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    contactNumber: paymentData.appointment.patient.contactNumber,
  };

  const result = await sslServices.initPayment(initiatePaymentData);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

// payload means ipn listener query
const validatePayment = async (payload: any) => {
  if (!payload || !payload.status || !(payload.status === "VALID")) {
    return {
      message: "Invalid payment!",
    };
  }

  const response = await sslServices.validatePayment(payload);

  if (response.status !== "VALID") {
    return {
      message: "Payment failed!",
    };
  }

  // const response = payload  //for local use

  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: "PAID",
        paymentGatewayData: response,
      },
    });

    await tx.appointment.update({
      where: {
        id: updatedPaymentData.appointmentId,
      },
      data: {
        paymentStatus: "PAID",
      },
    });
  });

  return {
    message: "Payment success!",
  };
};

export const paymentServices = {
  initPayment,
  validatePayment,
};
