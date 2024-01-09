import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/prisma/client";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-authentication";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const exisitingToken = await getVerificationTokenByEmail(email);
  if (exisitingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: exisitingToken.id,
      },
    });
  }
  const verificationToken = await prisma.verificationToken.create({
    data: {
      token,
      email,
      expires,
    },
  });
  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const exisitingToken = await getVerificationTokenByEmail(email);
  if (exisitingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: exisitingToken.id,
      },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      token,
      email,
      expires,
    },
  });
  return passwordResetToken;
};

export const generateTowFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const exisitingToken = await getTwoFactorTokenByEmail(email);
  if (exisitingToken) {
    await prisma.twoFactorToken.delete({
      where: {
        id: exisitingToken.id,
      },
    });
  }
  const twoFactorToken = await prisma.twoFactorToken.create({
    data: {
      token,
      email,
      expires,
    },
  });
  return twoFactorToken;
};
