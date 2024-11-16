import prisma from "../../../utils/prisma";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helper/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { sendEmail } from "../../../utils/sendEmail";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Login credential is incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_refresh_token_secret as Secret,
    config.jwt.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (
  user: any,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: "ACTIVE",
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Login credential is incorrect!");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.jwt_reset_password_secret as Secret,
    config.jwt.jwt_reset_password_expires_in as string
  );

  const resetPassLink = `${config.reset_password_link}?userId=${userData.id}&token=${resetPassToken}`;
  console.log(resetPassLink);
  await sendEmail(
    userData?.email,
    `
    <div>
    <p>Dear user,</p>
    <p>Your password reset link <a href=${resetPassLink}><button>Reset Password</button></a></p>
    </div>
    `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: "ACTIVE",
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.jwt_reset_password_secret as Secret
  );

  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: payload.id,
      status: "ACTIVE",
    },
    data: {
      password: hashedPassword,
    },
  });
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_refresh_token_secret as Secret
    );
  } catch (error) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: "ACTIVE",
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
