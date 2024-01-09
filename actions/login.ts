"use server";

import { signIn } from "@/auth";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-authentication";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTowFactorToken, generateVerificationToken } from "@/lib/token";
import { DEFAULT_REDIRECT_URL } from "@/route";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string
) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email doesn't exist" };
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(existingUser.email, verificationToken.token);
    return { success: "Confirmation email send!" };
  }
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid code" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code" };
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code has expired" };
      }
      await prisma?.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await prisma?.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
      await prisma?.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTowFactorToken(existingUser.email);
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_REDIRECT_URL,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
