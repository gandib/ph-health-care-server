import axios from "axios";
import config from "../../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const initPayment = async (paymentData: TPaymentData) => {
  try {
    const data = {
      store_id: config.ssl.store_id,
      store_passwd: config.ssl.store_pass,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId, // use unique tran_id for each api call
      success_url: config.ssl.success_url,
      fail_url: config.ssl.fail_url,
      cancel_url: config.ssl.cancel_url,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Appointment",
      product_category: "Service",
      product_profile: "general",
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: paymentData.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: paymentData.contactNumber,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: config.ssl.ssl_payment_api,
      data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment error occured!");
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.store_id}&store_passwd=${config.ssl.store_pass}&format=json`,
    });

    return response.data;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment validation failed!");
  }
};

export const sslServices = {
  initPayment,
  validatePayment,
};
