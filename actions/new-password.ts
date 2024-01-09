"use server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/client";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Token is missing" };
  }
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { password } = validatedFields.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Invalid token" };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User not found" };
  }

  const hashPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashPassword,
    },
  });
  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return { success: "Password updated successfully" };
};
