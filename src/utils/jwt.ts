import jwt from "jsonwebtoken";

import { IUser } from "../models";

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  EMAIL_VERIFICATION_TOKEN_SECRET,
} = process.env;

export const generateAccessToken = (userId: string, email: string) => {
  return jwt.sign({ sub: userId, email }, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ sub: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const generateEmailVerificationToken = (user: IUser) => {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      type: "EMAIL_VERIFICATION",
    },
    EMAIL_VERIFICATION_TOKEN_SECRET!,
    { expiresIn: "24h" }
  );
};

export const generateDiscordRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      sub: userId,
      type: "REFRESH",
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

export const verifyEmailToken = (token: string) => {
  return jwt.verify(token, EMAIL_VERIFICATION_TOKEN_SECRET);
};
