import { User, IUser, Waitlist } from "../models";

import EmailService from "./EmailService";

import { verificationEmail, welcomeEmail } from "../emails";
import { verifyEmailToken } from "../utils";

import {
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
  generateDiscordRefreshToken,
  verifyRefreshToken,
} from "../utils";

const { FRONTEND_URL } = process.env;

class AuthService {
  static async signUp(data: Partial<IUser>): Promise<IUser> {
    const existingEmail = await User.findOne({ email: data.email });

    const existingUsername = await User.findOne({ username: data.username });

    if (existingEmail && existingUsername) {
      const error = new Error(
        "Cet email et ce nom d'utilisateur sont déjà utilisés."
      ) as Error & {
        code?: string;
      };

      error.code = "EMAIL_AND_USERNAME_ALREADY_USED";
      throw error;
    }

    if (existingEmail) {
      if (existingEmail.authProvider === "DISCORD") {
        const error = new Error(
          "Cet email est déjà utilisé via Discord. Veuillez vous connecter avec Discord."
        ) as Error & {
          code?: string;
        };

        error.code = "EMAIL_ALREADY_USED_BY_DISCORD";
        throw error;
      }

      const error = new Error("Cet email est déjà utilisé.") as Error & {
        code?: string;
      };

      error.code = "EMAIL_ALREADY_USED";
      throw error;
    }

    if (existingUsername) {
      const error = new Error(
        "Ce nom d'utilisateur est déjà utilisé."
      ) as Error & {
        code?: string;
      };

      error.code = "USERNAME_ALREADY_USED";
      throw error;
    }

    let user: IUser = new User({
      username: data.username,
      email: data.email.toLowerCase(),
      password: data.password,
      roles: ["MEMBER"],
      isEmailVerified: false,
      profilePicture: null,
      description: null,
      refreshTokens: [],
      isDeleted: false,
    });

    const userInWailist = await Waitlist.findOneAndUpdate(
      { email: user.email },
      { userId: user._id }
    );

    if (userInWailist) user.referalCode = userInWailist.code;

    if (data.referalCode && !userInWailist) {
      const referalCodeInWaitlist = await Waitlist.findOne({
        code: data.referalCode,
      });

      if (referalCodeInWaitlist)
        user.sponsoredBy = referalCodeInWaitlist.userId;
    }

    await user.save();

    const emailVerificationToken = generateEmailVerificationToken(user);

    await EmailService.sendEmail(
      user.email,
      "Vérifiez votre adresse email",
      verificationEmail(
        user.username,
        `${FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
      )
    );

    return user;
  }

  static async verifyEmail(token: string): Promise<boolean> {
    const decoded = verifyEmailToken(token);

    if (typeof decoded === "string" || decoded.type !== "EMAIL_VERIFICATION") {
      const error = new Error("Token invalide") as Error & {
        code?: string;
      };

      error.code = "INVALID_TOKEN";
      throw error;
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      const error = new Error("Utilisateur introuvable") as Error & {
        code?: string;
      };

      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.isEmailVerified) {
      const error = new Error("Email déjà vérifié") as Error & {
        code?: string;
      };

      error.code = "EMAIL_ALREADY_VERIFIED";
      throw error;
    }

    if (user.email !== decoded.email) {
      const error = new Error("Email non correspondant") as Error & {
        code?: string;
      };

      error.code = "EMAIL_MISMATCH";
      throw error;
    }

    user.isEmailVerified = true;
    await user.save();

    await EmailService.sendEmail(
      user.email,
      "Bienvenue sur Scanverse - Votre compte a été activé",
      welcomeEmail(user.username, `${process.env.FRONTEND_URL}/connexion`)
    );

    return true;
  }

  static async resendVerification(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const error = new Error("Utilisateur introuvable") as Error & {
        code?: string;
      };

      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.isEmailVerified) {
      const error = new Error("Email déjà vérifié") as Error & {
        code?: string;
      };

      error.code = "EMAIL_ALREADY_VERIFIED";
      throw error;
    }

    const emailVerificationToken = generateEmailVerificationToken(user);

    await EmailService.sendEmail(
      user.email,
      "Vérifiez votre adresse email",
      verificationEmail(
        user.username,
        `${FRONTEND_URL}/verify-email?token=${emailVerificationToken}`
      )
    );

    return true;
  }

  static async signIn(
    email: string,
    password: string,
    deviceInfo: string
  ): Promise<IUser & { accessToken: string }> {
    const user = await User.findOne({ email }).select("+password").exec();

    if (user.isDeleted) {
      const error = new Error("Ce compte a été supprimé.") as Error & {
        code?: string;
      };

      error.code = "ACCOUNT_DELETED";
      throw error;
    }

    if (!user) {
      const error = new Error("Identifiants invalides.") as Error & {
        code?: string;
      };

      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      const error = new Error("Identifiants invalides.") as Error & {
        code?: string;
      };

      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    if (!user.isEmailVerified) {
      const error = new Error(
        "Veuillez vérifier votre adresse email avant de vous connecter."
      ) as Error & {
        code?: string;
      };

      error.code = "EMAIL_NOT_VERIFIED";
      throw error;
    }

    const userId = user._id.toString();

    const accessToken = generateAccessToken(userId, user.email);
    const refreshToken = generateRefreshToken(userId);

    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo,
    });

    if (user.refreshTokens.length > 2) {
      user.refreshTokens = user.refreshTokens
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 2);
    }

    await user.save();

    return { ...user.toObject(), accessToken } as unknown as IUser & {
      accessToken: string;
    };
  }

  static async discordSignIn(
    user: Partial<IUser>,
    deviceInfo: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userId = user._id as string;

    const accessToken = generateAccessToken(userId, user.email);

    const refreshToken = generateDiscordRefreshToken(userId);

    user.password = null;

    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo,
    });

    if (user.refreshTokens.length > 2) {
      user.refreshTokens = user.refreshTokens
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 2);
    }

    await user.save();

    return { accessToken, refreshToken };
  }

  static async me(userId: string) {
    const user = await User.findById(userId).select("-password -refreshTokens");

    if (!user) {
      const error = new Error("Utilisateur introuvable.") as Error & {
        code?: string;
      };

      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (user.isDeleted) {
      const error = new Error("Ce compte a été supprimé.") as Error & {
        code?: string;
      };

      error.code = "ACCOUNT_DELETED";
      throw error;
    }

    return user;
  }

  static async refresh(
    token: string,
    deviceInfo: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let decoded;

    try {
      decoded = verifyRefreshToken(token);
    } catch (error) {
      const err = new Error("Token de rafraîchissement invalide.") as Error & {
        code?: string;
      };

      err.code = "INVALID_REFRESH_TOKEN";
      throw err;
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
      const error = new Error("Utilisateur introuvable.") as Error & {
        code?: string;
      };

      error.code = "USER_NOT_FOUND";
      throw error;
    }

    const tokenExists = user.refreshTokens.some(
      (rt) => rt.token === token && rt.expiresAt > new Date()
    );

    if (!tokenExists) {
      const error = new Error(
        "Token de rafraîchissement invalide ou expiré."
      ) as Error & {
        code?: string;
      };

      error.code = "INVALID_OR_EXPIRED_REFRESH_TOKEN";
      throw error;
    }

    const userId = user._id.toString();

    const accessToken = generateAccessToken(userId, user.email);

    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== token);

    const newRefreshToken = generateRefreshToken(userId);

    user.refreshTokens.push({
      token: newRefreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: deviceInfo,
    });

    await user.save();

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async signOut(token: string): Promise<boolean> {
    let decoded;

    try {
      decoded = verifyRefreshToken(token);
    } catch (error) {
      const err = new Error("Token de rafraîchissement invalide.") as Error & {
        code?: string;
      };

      err.code = "INVALID_REFRESH_TOKEN";
      throw err;
    }

    await User.findByIdAndUpdate(decoded.sub, {
      $pull: { refreshTokens: { token: token } },
    });

    return true;
  }

  static async unlinkDiscord(user: Partial<IUser>): Promise<boolean> {
    const userId = user.id;

    const userFromDB = await User.findById(userId);

    if (!userFromDB) {
      const error = new Error("Utilisateur introuvable.") as Error & {
        code?: string;
      };

      error.code = "USER_NOT_FOUND";
      throw error;
    }

    if (!userFromDB.password) {
      const error = new Error(
        "Impossible de délier votre compte Discord : vous devez d'abord définir un mot de passe."
      ) as Error & {
        code?: string;
      };

      error.code = "PASSWORD_REQUIRED";
      throw error;
    }

    userFromDB.discordId = null;
    userFromDB.discordUsername = null;
    userFromDB.discordDiscriminator = null;
    userFromDB.authProvider = "LOCAL";

    await userFromDB.save();

    return true;
  }
}

export default AuthService;
