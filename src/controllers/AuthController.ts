import { Request, Response } from "express";

import { AuthService } from "@/services/AuthService";
import EmailService from "@/services/EmailService";

import { welcomeEmail, verificationEmail } from "@/emails";

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Inscription d'un nouvel utilisateur
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, referredBy } = req.body;

      const { user, message } = await AuthService.register({
        username,
        email,
        password,
        referredBy,
      });

      try {
        const emailContent = verificationEmail(
          username,
          `${process.env.FRONTEND_URL}/verify-email?token=${user.emailVerificationToken}`
        );

        const emailResult = await EmailService.sendEmail({
          to: email,
          subject: "✅ Vérifiez votre adresse email pour Scanverse",
          html: emailContent,
        });

        if (!emailResult.success) {
          console.error(
            `⚠️ Email de vérification non envoyé pour ${email}:`,
            emailResult.error
          );
          // On continue quand même, l'inscription est valide
        }
      } catch (emailError) {
        // Log de l'erreur mais on ne bloque pas l'inscription
        console.error(
          `❌ Erreur lors de l'envoi de l'email à ${email}:`,
          emailError
        );
      }

      delete user.emailVerificationToken;

      res.status(201).json({
        success: true,
        data: { user },
        message: message,
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      if (err.code === "EMAIL_IN_USE") {
        res.status(400).json({
          success: false,
          message: "L'adresse email est déjà utilisée",
          errors: { email: err.message },
        });
        return;
      }

      if (err.code === "USERNAME_IN_USE") {
        res.status(400).json({
          success: false,
          message: "Le nom d'utilisateur est déjà utilisé",
          errors: { username: err.message },
        });
        return;
      }

      if (err.code === "INVALID_PASSWORD") {
        res.status(400).json({
          success: false,
          message: "Mot de passe invalide",
          errors: { password: err.message },
        });
        return;
      }

      if (err.code === "INVALID_REFERRAL_CODE") {
        res.status(400).json({
          success: false,
          message: "Code de parrainage invalide",
          errors: { referredBy: err.message },
        });
        return;
      }

      console.error("Erreur lors de l'inscription :", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'inscription",
        errors: { global: err.message },
      });
    }
  }

  /**
   * POST /api/v1/auth/verify-email
   * Vérification de l'email
   */
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.get("user-agent");

      const { user, tokens, message } = await AuthService.verifyEmail({
        token,
        ipAddress,
        userAgent,
      });
      try {
        const emailContent = welcomeEmail(
          user.username,
          `${process.env.FRONTEND_URL}/profil`,
          user.referralCode || ""
        );

        const emailResult = await EmailService.sendEmail({
          to: user.email,
          subject: "✨ Bienvenue sur Scanverse",
          html: emailContent,
        });

        if (!emailResult.success) {
          console.error(
            `⚠️ Email de bienvenue non envoyé pour ${user.email}:`,
            emailResult.error
          );
          // On continue quand même, l'inscription est valide
        }
      } catch (emailError) {
        // Log de l'erreur mais on ne bloque pas l'inscription
        console.error(
          `❌ Erreur lors de l'envoi de l'email à ${user.email}:`,
          emailError
        );
      }

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          user: user,
          accessToken: tokens.accessToken,
        },
        message,
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      if (err.code === "INVALID_TOKEN") {
        res.status(400).json({
          success: false,
          message: "Token invalide ou expiré",
          errors: { token: err.message },
        });
        return;
      }

      if (err.code === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
          errors: { token: err.message },
        });
        return;
      }

      if (err.code === "EMAIL_ALREADY_VERIFIED") {
        res.status(400).json({
          success: false,
          message: "Email déjà vérifié",
          errors: { token: err.message },
        });
        return;
      }

      if (err.code === "TOKEN_ALREADY_USED") {
        res.status(400).json({
          success: false,
          message: "Token déjà utilisé",
          errors: { token: err.message },
        });
        return;
      }

      console.error("Erreur lors de la vérification de l'email :", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification de l'email",
        errors: { global: err.message },
      });
    }
  }

  /**
   * POST /api/v1/auth/resend-verification
   * Renvoyer l'email de vérification
   */
  static async resendVerificationEmail(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;

      const { user, message } = await AuthService.resendVerificationEmail({
        email,
      });

      try {
        const emailContent = verificationEmail(
          user.username,
          `${process.env.FRONTEND_URL}/verify-email?token=${user.emailVerificationToken}`
        );

        const emailResult = await EmailService.sendEmail({
          to: email,
          subject: "✅ Vérifiez votre adresse email pour Scanverse",
          html: emailContent,
        });

        if (!emailResult.success) {
          console.error(
            `⚠️ Email de vérification non envoyé pour ${email}:`,
            emailResult.error
          );
          // On continue quand même, l'inscription est valide
        }
      } catch (emailError) {
        // Log de l'erreur mais on ne bloque pas l'inscription
        console.error(
          `❌ Erreur lors de l'envoi de l'email à ${email}:`,
          emailError
        );
      }

      delete user.emailVerificationToken;

      res.status(200).json({ success: true, data: { user }, message });
    } catch (error) {
      const err = error as Error & { code?: string };

      if (err.code === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
          errors: { token: err.message },
        });
        return;
      }

      if (err.code === "EMAIL_ALREADY_VERIFIED") {
        res.status(400).json({
          success: false,
          message: "Email déjà vérifié",
          errors: { token: err.message },
        });
        return;
      }

      console.error("Erreur lors du renvoi de l'email de vérification :", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors du renvoi de l'email de vérification",
        errors: { global: (error as Error).message },
      });
    }
  }

  /**
   * POST /api/v1/auth/login
   * Connexion d'un utilisateur
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.get("user-agent");

      const { user, tokens } = await AuthService.login({
        email,
        password,
        ipAddress,
        userAgent,
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      res.status(200).json({
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      if (err.code === "INVALID_CREDENTIALS") {
        res.status(401).json({
          success: false,
          message: "Email ou mot de passe invalide",
          errors: { global: err.message },
        });
        return;
      }

      if (err.code === "EMAIL_NOT_VERIFIED") {
        res.status(403).json({
          success: false,
          message: "Email non vérifié",
          errors: { global: err.message },
        });
        return;
      }

      if (err.code === "ACCOUNT_SUSPENDED" || err.code === "ACCOUNT_DELETED") {
        res.status(403).json({
          success: false,
          message: "Compte suspendu",
          errors: { global: err.message },
        });
        return;
      }

      console.error("Erreur lors de la connexion :", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la connexion",
        errors: { global: err.message },
      });
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Rafraîchir l'access token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const currentToken = req.cookies.refreshToken;

      if (!currentToken) {
        res.status(401).json({
          success: false,
          message: "Refresh token manquant",
        });
        return;
      }

      const ipAddress =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        "unknown";
      const userAgent = req.headers["user-agent"] || "unknown";

      const { accessToken, refreshToken } = await AuthService.refreshToken({
        refreshToken: currentToken,
        ipAddress,
        userAgent,
      });

      // ✅ Envoyer le nouveau refresh token dans un cookie HTTP-only
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS en prod
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        path: "/",
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken: accessToken,
        },
        message: "Token rafraîchi avec succès",
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      if (err.code === "INVALID_TOKEN") {
        res.status(401).json({
          success: false,
          message: "Token invalide ou expiré",
          errors: { global: err.message },
        });
        return;
      }

      console.error("Erreur lors du rafraîchissement du token:", error);
      res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }
  }
}
