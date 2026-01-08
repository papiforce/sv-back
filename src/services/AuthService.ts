import crypto from "crypto";

import UserModel, { IUser } from "@/models/UserModel";

import { JWTUtils, JWTPayload } from "@/utils/jwt";

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

export interface ForgotPasswordDTO {
  email: string;
}

export interface ForgotPasswordResponse {
  username?: string;
  email?: string;
  token?: string;
  message: string;
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
    loginCount: number;
    lastLoginAt?: Date;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface GetUserProfileDTO {
  userId: string;
}

export interface GetUserProfileResponse {
  user: {
    id: string;
    email: string;
    username: string;
    roles: string[];
    loginCount: number;
    lastLoginAt?: Date;
    emailVerified: boolean;
    profilePicture?: string;
    accountStatus: string;
    referredBy?: any;
  };
}

export interface RefreshTokenDTO {
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
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

      // 3. Vérifier le code de parrainage
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

      // 4. Créer l'utilisateur
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

      user.generateEmailVerificationToken(token);

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
        .populate("referredBy", {
          _id: 1,
          username: 1,
        });

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

      await user.verifyEmail();
      await user.incrementLoginCount();

      const jwtPayload: JWTPayload = {
        userId: user._id as unknown as string,
        email: user.email,
        roles: user.roles,
      };

      const tokens = JWTUtils.generateTokens(jwtPayload);

      await user.addRefreshToken(tokens.refreshToken, ipAddress, userAgent);

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

      user.generateEmailVerificationToken(token);

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
   * Demander une réinitialisation de mot de passe
   */
  static async forgotPassword(
    data: ForgotPasswordDTO
  ): Promise<ForgotPasswordResponse> {
    try {
      const { email } = data;

      // ✅ 1. Validation de l'email
      if (!email || !email.trim()) {
        const error = new Error("Email requis");
        (error as Error & { code?: string }).code = "EMAIL_REQUIRED";
        throw error;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const error = new Error("Format d'email invalide");
        (error as Error & { code?: string }).code = "INVALID_EMAIL_FORMAT";
        throw error;
      }

      // ✅ 2. Rechercher l'utilisateur
      const user = await UserModel.findOne({
        email: email.toLowerCase(),
      }).select("+passwordResetToken +passwordResetExpires");

      // ⚠️ Important : Ne pas révéler si l'email existe ou non (sécurité)
      // On retourne toujours un succès même si l'utilisateur n'existe pas
      if (!user) {
        return {
          message:
            "Si cet email existe, un lien de réinitialisation a été envoyé",
        };
      }

      // ✅ 3. Vérifier que l'utilisateur a vérifié son email
      if (!user.emailVerified) {
        // On retourne quand même un succès pour ne pas révéler l'existence du compte
        return {
          message:
            "Si cet email existe, un lien de réinitialisation a été envoyé",
        };
      }

      // ✅ 4. Générer un token de réinitialisation (valide 1 heure)
      const token = JWTUtils.generatePasswordResetToken(
        user._id as unknown as string
      );

      user.generatePasswordResetToken(token);

      await user.save();

      return {
        username: user.username,
        email: user.email,
        token,
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé",
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
   * Réinitialiser le mot de passe avec un token
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{
    message: string;
    username: string;
    email: string;
  }> {
    // ✅ 1. Validation du token
    if (!token || !token.trim()) {
      const error = new Error("Token de réinitialisation requis");
      (error as Error & { code?: string }).code = "TOKEN_REQUIRED";
      throw error;
    }

    const decoded = JWTUtils.verifyEmailToken(token);

    if (decoded.type !== "reset-password") {
      const error = new Error("Token invalide");
      (error as Error & { code?: string }).code = "INVALID_TOKEN";
      throw error;
    }

    const user = await UserModel.findById(decoded.userId).select(
      "+password +passwordResetToken +passwordResetExpires"
    );

    if (!user) {
      const error = new Error("Utilisateur non trouvé");
      (error as Error & { code?: string }).code = "USER_NOT_FOUND";
      throw error;
    }

    if (!user.emailVerified) {
      const error = new Error(
        "Email pas encore vérifié. Consultez votre boîte de réception."
      );
      (error as Error & { code?: string }).code = "EMAIL_NOT_VERIFIED";
      throw error;
    }

    // ✅ 3. Vérifier que le nouveau mot de passe est différent de l'ancien
    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
      const error = new Error(
        "Le nouveau mot de passe doit être différent de l'ancien"
      );
      (error as Error & { code?: string }).code = "SAME_PASSWORD";
      throw error;
    }

    // ✅ 4. Hasher le token reçu pour le comparer avec celui en DB
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    if (
      user.passwordResetToken !== resetTokenHash ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      const error = new Error("Token invalide ou expiré");
      (error as Error & { code?: string }).code = "INVALID_TOKEN";
      throw error;
    }

    // ✅ 5. Mettre à jour le mot de passe et supprimer le token de reset
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // ✅ 6. Invalider tous les refresh tokens existants (forcer reconnexion)
    user.refreshTokens = [];

    await user.save();

    return {
      username: user.username,
      email: user.email,
      message: "Mot de passe réinitialisé avec succès",
    };
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

      const isPasswordValid = await user.comparePassword(password);

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

      await user.addRefreshToken(tokens.refreshToken, ipAddress, userAgent);
      await user.incrementLoginCount();

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
          loginCount: user.loginCount || 0,
          lastLoginAt: user.lastLoginAt,
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
   * Récupérer le profil de l'utilisateur connecté
   */
  static async getUserProfile(
    data: GetUserProfileDTO
  ): Promise<GetUserProfileResponse> {
    try {
      const { userId } = data;

      if (!userId) {
        const error = new Error("ID utilisateur manquant");
        (error as Error & { code?: string }).code = "MISSING_USER_ID";
        throw error;
      }

      const user = await UserModel.findById(userId)
        .select("-__v")
        .populate("referredBy", {
          _id: 1,
          username: 1,
        });

      if (!user) {
        const error = new Error("Utilisateur non trouvé");
        (error as Error & { code?: string }).code = "USER_NOT_FOUND";
        throw error;
      }

      return {
        user: {
          id: user._id as unknown as string,
          email: user.email,
          username: user.username,
          roles: user.roles,
          profilePicture: user.profilePicture,
          accountStatus: user.accountStatus,
          loginCount: user.loginCount || 0,
          lastLoginAt: user.lastLoginAt,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur de l'obtention de l'utilisateur :", error);
      throw new Error("Erreur de l'obtention de l'utilisateur");
    }
  }

  /**
   * Rafraîchir l'access token
   */
  static async refreshToken(
    data: RefreshTokenDTO
  ): Promise<RefreshTokenResponse> {
    try {
      const { refreshToken, ipAddress, userAgent } = data;

      const decoded = JWTUtils.verifyRefreshToken(refreshToken);

      // ✅ Vérifier que le token existe ET n'est pas expiré
      const user = await UserModel.findOne({
        _id: decoded.userId,
        "refreshTokens.token": refreshToken,
        "refreshTokens.expiresAt": { $gt: new Date() }, // Pas expiré
      }).select("+refreshTokens");

      if (!user) {
        const error = new Error("Token invalide ou expiré");
        (error as Error & { code?: string }).code = "INVALID_TOKEN";
        throw error;
      }

      // ✅ Supprimer l'ancien refresh token
      await user.removeRefreshToken(refreshToken);

      const jwtPayload: JWTPayload = {
        userId: user._id as unknown as string,
        email: user.email,
        roles: user.roles,
      };

      const tokens = JWTUtils.generateTokens(jwtPayload);

      // ✅ Sauvegarder le nouveau refresh token avec expiration
      await user.addRefreshToken(tokens.refreshToken, ipAddress, userAgent);

      return tokens;
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur de rafraîchissement du token :", error);
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
    try {
      const user = await UserModel.findById(userId).select("+refreshTokens");

      if (!user) {
        const error = new Error("Utilisateur non trouvé");
        (error as Error & { code?: string }).code = "USER_NOT_FOUND";
        throw error;
      }

      await user.removeRefreshToken(refreshToken);

      return { message: "Déconnexion réussie" };
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur lors de la déconnexion :", error);
      throw new Error("Erreur lors de la déconnexion");
    }
  }

  /**
   * ✅ Nettoyer les tokens expirés (à exécuter via un cron job)
   */
  static async cleanExpiredTokens(): Promise<{
    refreshTokens: number;
    emailVerificationTokens: number;
    passwordResetTokens: number;
    totalModified: number;
  }> {
    const now = new Date();

    try {
      // ✅ Exécuter toutes les opérations en une seule transaction bulk
      const bulkOps = [
        // 1️⃣ Nettoyer les refresh tokens expirés
        {
          updateMany: {
            filter: {
              "refreshTokens.expiresAt": { $lt: now },
            },
            update: {
              $pull: {
                refreshTokens: {
                  expiresAt: { $lt: now },
                },
              },
            },
          },
        },
        // 2️⃣ Nettoyer les tokens de vérification d'email expirés
        {
          updateMany: {
            filter: {
              emailVerificationExpires: { $lt: now },
              emailVerificationToken: { $exists: true },
            },
            update: {
              $unset: {
                emailVerificationToken: "",
                emailVerificationExpires: "",
              },
            },
          },
        },
        // 3️⃣ Nettoyer les tokens de reset de mot de passe expirés
        {
          updateMany: {
            filter: {
              passwordResetExpires: { $lt: now },
              passwordResetToken: { $exists: true },
            },
            update: {
              $unset: {
                passwordResetToken: "",
                passwordResetExpires: "",
              },
            },
          },
        },
      ];

      const result = await UserModel.bulkWrite(bulkOps);

      const stats = {
        refreshTokens: result.modifiedCount || 0,
        emailVerificationTokens: 0,
        passwordResetTokens: 0,
        totalModified: result.modifiedCount || 0,
      };

      console.log("🧹 Nettoyage des tokens expirés terminé:", stats);

      return stats;
    } catch (error) {
      console.error("❌ Erreur lors du nettoyage des tokens:", error);
      throw error;
    }
  }
}
