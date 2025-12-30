import crypto from "crypto";

import UserModel, { AccountStatus, IUser } from "../models/UserModel";

import { PasswordUtils } from "../utils/password";
import { JWTUtils, JWTPayload } from "../utils/jwt";

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  referredBy?: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    username: string;
    email: string;
    emailVerificationToken?: string;
  };
  message: string;
}

export interface VerifyEmailDTO {
  token: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface VerifyEmailResponse {
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
    referralCode?: string;
    referredBy?: any;
    profilePicture?: string;
    accountStatus: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface ResendVerificationEmailDTO {
  email: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
    referralCode?: string;
    referredBy?: any;
    emailVerified: boolean;
    profilePicture?: string;
    accountStatus: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  /**
   * Inscription - PAS de tokens générés
   */
  static async register(data: RegisterDTO): Promise<RegisterResponse> {
    try {
      const { username, email, password, referredBy } = data;

      // 1. Vérifier si l'email existe déjà
      const existingEmail = await UserModel.findOne({
        email: email.toLowerCase(),
      });
      if (existingEmail) {
        const error = new Error("Cette adresse email est déjà utilisée");
        (error as Error & { code?: string }).code = "EMAIL_IN_USE";
        throw error;
      }

      // 2. Vérifier si le username existe déjà
      const existingUsername = await UserModel.findOne({
        username: { $regex: new RegExp(`^${username}$`, "i") },
      });
      if (existingUsername) {
        const error = new Error("Ce nom d'utilisateur est déjà pris");
        (error as Error & { code?: string }).code = "USERNAME_IN_USE";
        throw error;
      }

      // 3. Valider le mot de passe
      const passwordValidation = PasswordUtils.validate(password);
      if (!passwordValidation.isValid) {
        const error = new Error(passwordValidation.errors.join(", "));
        (error as Error & { code?: string }).code = "INVALID_PASSWORD";
        throw error;
      }

      // 4. Vérifier le code de parrainage
      let referrer: IUser | null = null;
      if (referredBy) {
        referrer = await UserModel.findOne({
          referralCode: referredBy.toUpperCase(),
          accountStatus: "ACTIVE",
        });

        if (!referrer) {
          const error = new Error("Code de parrainage invalide");
          (error as Error & { code?: string }).code = "INVALID_REFERRAL_CODE";
          throw error;
        }
      }

      // 5. Créer l'utilisateur
      const user = await UserModel.create({
        username,
        email: email.toLowerCase(),
        password,
        roles: ["MEMBER"],
        referredBy: referrer?._id,
      });

      const token = JWTUtils.generateEmailVerificationToken(
        user._id as unknown as string
      );

      user.emailVerificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      user.emailVerificationExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 heures

      user.save();

      return {
        user: {
          id: user._id as unknown as string,
          username: user.username,
          email: user.email,
          emailVerificationToken: token,
        },
        message:
          "Inscription réussie ! Vérifiez votre email pour activer votre compte.",
      };
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur lors de l'inscription :", error);
      throw new Error("Erreur lors de l'inscription");
    }
  }

  /**
   * Vérification de l'email - Génère les tokens ICI
   */
  static async verifyEmail(data: VerifyEmailDTO): Promise<VerifyEmailResponse> {
    try {
      const { token, ipAddress, userAgent } = data;

      const decoded = JWTUtils.verifyEmailToken(token);

      if (decoded.type !== "email-verification") {
        const error = new Error("Token invalide");
        (error as Error & { code?: string }).code = "INVALID_TOKEN";
        throw error;
      }

      const user = await UserModel.findById(decoded.userId)
        .select(
          "+emailVerificationToken +emailVerificationExpires +refreshTokens"
        )
        .populate("referredBy");

      if (!user) {
        const error = new Error("Utilisateur non trouvé");
        (error as Error & { code?: string }).code = "USER_NOT_FOUND";
        throw error;
      }

      if (user.emailVerified) {
        const error = new Error("Email déjà vérifié. Veuillez vous connecter.");
        (error as Error & { code?: string }).code = "EMAIL_ALREADY_VERIFIED";
        throw error;
      }

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      if (
        user.emailVerificationToken !== hashedToken ||
        !user.emailVerificationExpires ||
        user.emailVerificationExpires < new Date()
      ) {
        const error = new Error("Token invalide ou expiré");
        (error as Error & { code?: string }).code = "INVALID_TOKEN";
        throw error;
      }

      user.accountStatus = AccountStatus.ACTIVE;
      user.emailVerified = true;
      user.emailVerifiedAt = new Date();

      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;

      user.loginCount += 1;
      user.lastLoginAt = new Date();

      const jwtPayload: JWTPayload = {
        userId: user._id as unknown as string,
        email: user.email,
        roles: user.roles,
      };

      const tokens = JWTUtils.generateTokens(jwtPayload);

      // ✅ Sauvegarder le refresh token avec expiration
      user.refreshTokens.push({
        token: tokens.refreshToken,
        createdAt: new Date(),
        expiresAt: JWTUtils.getRefreshTokenExpiration(),
        ipAddress,
        userAgent,
      });

      await user.save();

      return {
        user: {
          id: user._id as unknown as string,
          username: user.username,
          email: user.email,
          roles: user.roles,
          referralCode: user.referralCode,
          profilePicture: user.profilePicture,
          accountStatus: user.accountStatus,
        },
        tokens,
        message: "Email vérifié ! Vous êtes maintenant connecté.",
      };
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur lors de la vérification de l'email :", error);
      throw new Error("Token invalide ou expiré");
    }
  }

  /**
   * Renvoyer l'email de vérification
   */
  static async resendVerificationEmail(
    data: ResendVerificationEmailDTO
  ): Promise<RegisterResponse> {
    try {
      const { email } = data;

      const user = await UserModel.findByEmail(
        email,
        "+emailVerificationToken +emailVerificationExpires"
      );

      if (!user) {
        const error = new Error("Utilisateur non trouvé");
        (error as Error & { code?: string }).code = "USER_NOT_FOUND";
        throw error;
      }

      if (user.emailVerified) {
        const error = new Error("Email déjà vérifié. Veuillez vous connecter.");
        (error as Error & { code?: string }).code = "EMAIL_ALREADY_VERIFIED";
        throw error;
      }

      const token = JWTUtils.generateEmailVerificationToken(
        user._id as unknown as string
      );

      user.emailVerificationToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      user.emailVerificationExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 heures

      user.save();

      return {
        user: {
          id: user._id as unknown as string,
          username: user.username,
          email: user.email,
          emailVerificationToken: token,
        },
        message:
          "Email de vérification renvoyé avec succès. Vérifiez votre boîte de réception.",
      };
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error(
        "Erreur lors du renvoi de l'email de vérification :",
        error
      );
      throw new Error("Erreur lors du renvoi de l'email de vérification");
    }
  }

  /**
   * Connexion
   */
  static async login(data: LoginDTO): Promise<LoginResponse> {
    try {
      const { email, password, ipAddress, userAgent } = data;

      const user = await UserModel.findOne({
        email: email.toLowerCase(),
      })
        .select("+password +refreshTokens")
        .populate("referredBy", {
          _id: 1,
          username: 1,
        });

      if (!user) {
        const error = new Error("Email ou mot de passe incorrect");
        (error as Error & { code?: string }).code = "INVALID_CREDENTIALS";
        throw error;
      }

      const isPasswordValid = await PasswordUtils.compare(
        password,
        user.password
      );

      if (!isPasswordValid) {
        const error = new Error("Email ou mot de passe incorrect");
        (error as Error & { code?: string }).code = "INVALID_CREDENTIALS";
        throw error;
      }

      if (!user.emailVerified) {
        const error = new Error(
          "Veuillez vérifier votre email avant de vous connecter"
        );
        (error as Error & { code?: string }).code = "EMAIL_NOT_VERIFIED";
        throw error;
      }

      if (user.accountStatus === "SUSPENDED") {
        const error = new Error(
          "Votre compte est suspendu. Contactez le support."
        );
        (error as Error & { code?: string }).code = "ACCOUNT_SUSPENDED";
        throw error;
      }

      if (user.accountStatus === "DELETED") {
        const error = new Error("Ce compte n'existe plus");
        (error as Error & { code?: string }).code = "ACCOUNT_DELETED";
        throw error;
      }

      const jwtPayload: JWTPayload = {
        userId: user._id as unknown as string,
        email: user.email,
        roles: user.roles,
      };

      const tokens = JWTUtils.generateTokens(jwtPayload);

      // ✅ Sauvegarder le refresh token avec expiration
      user.refreshTokens.push({
        token: tokens.refreshToken,
        createdAt: new Date(),
        expiresAt: JWTUtils.getRefreshTokenExpiration(),
        ipAddress,
        userAgent,
      });

      user.lastLoginAt = new Date();
      await user.save();

      return {
        user: {
          id: user._id as unknown as string,
          username: user.username,
          email: user.email,
          roles: user.roles,
          referralCode: user.referralCode,
          emailVerified: user.emailVerified,
          profilePicture: user.profilePicture,
          accountStatus: user.accountStatus,
          referredBy: user.referredBy,
        },
        tokens,
      };
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur lors de la connexion :", error);
      throw new Error("Erreur lors de la connexion");
    }
  }

  /**
   * Rafraîchir l'access token
   */
  static async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const decoded = JWTUtils.verifyRefreshToken(refreshToken);

      // ✅ Vérifier que le token existe ET n'est pas expiré
      const user = await UserModel.findOne({
        _id: decoded.userId,
        "refreshTokens.token": refreshToken,
        "refreshTokens.expiresAt": { $gt: new Date() }, // Pas expiré
      });

      if (!user) {
        const error = new Error("Token invalide ou expiré");
        (error as Error & { code?: string }).code = "INVALID_TOKEN";
        throw error;
      }

      // ✅ Supprimer l'ancien refresh token
      user.refreshTokens = user.refreshTokens.filter(
        (rt: any) => rt.token !== refreshToken
      );

      const jwtPayload: JWTPayload = {
        userId: user._id as unknown as string,
        email: user.email,
        roles: user.roles,
      };

      const tokens = JWTUtils.generateTokens(jwtPayload);

      // ✅ Sauvegarder le nouveau refresh token avec expiration
      user.refreshTokens.push({
        token: tokens.refreshToken,
        createdAt: new Date(),
        expiresAt: JWTUtils.getRefreshTokenExpiration(),
      });
      await user.save();

      return tokens;
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur de rafraîchissement du token:", error);
      throw new Error("Token invalide ou expiré");
    }
  }

  /**
   * Déconnexion
   */
  static async logout(
    userId: string,
    refreshToken: string
  ): Promise<{ message: string }> {
    const user = await UserModel.findById(userId);

    if (!user) {
      const error = new Error("Utilisateur non trouvé");
      (error as Error & { code?: string }).code = "USER_NOT_FOUND";
      throw error;
    }

    user.refreshTokens = user.refreshTokens.filter(
      (rt: any) => rt.token !== refreshToken
    );
    await user.save();

    return { message: "Déconnexion réussie" };
  }

  /**
   * ✅ Nettoyer les tokens expirés (à exécuter via un cron job)
   */
  static async cleanExpiredTokens(): Promise<void> {
    await UserModel.updateMany(
      {},
      {
        $pull: {
          refreshTokens: {
            expiresAt: { $lt: new Date() },
          },
        },
      }
    );
  }
}
