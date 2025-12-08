import { Request, Response } from "express";

import { AuthService } from "../services";

class AuthController {
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;

      let errors: Record<string, string> = {};

      if (!username || username === "") {
        errors["username"] = "Le nom d'utilisateur est requis.";
      }

      if (!email || email === "") {
        errors["email"] = "L'email est requis.";
      }

      if (!password || password === "") {
        errors["password"] = "Le mot de passe est requis.";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json({
          success: false,
          errors,
        });

        return;
      }

      await AuthService.signUp({ username, email, password });

      res.status(201).json({
        success: true,
      });

      return;
    } catch (error) {
      const errors = [
        "EMAIL_AND_USERNAME_ALREADY_USED",
        "EMAIL_ALREADY_USED",
        "USERNAME_ALREADY_USED",
        "EMAIL_ALREADY_USED_BY_DISCORD",
      ];

      if (errors.includes((error as Error & { code?: string }).code || "")) {
        res.status(409).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'inscription.",
        errors: { global: (error as Error).message },
      });

      return;
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ message: "Token requis" });

        return;
      }

      await AuthService.verifyEmail(token);

      res.status(200).json({ success: true });

      return;
    } catch (error) {
      const errors = ["EMAIL_ALREADY_VERIFIED", "EMAIL_MISMATCH"];

      if (errors.includes((error as Error & { code?: string }).code || "")) {
        res.status(409).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      if ((error as Error & { code?: string }).code === "TOKEN_INVALID") {
        res.status(400).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      if ((error as Error & { code?: string }).code === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Une erreur est survenue lors de la vérification de votre adresse email.",
        errors: { global: (error as Error).message },
      });

      return;
    }
  }

  async resendVerificationEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Email requis" });

        return;
      }

      await AuthService.resendVerification(email);

      res.status(200).json({ success: true });
    } catch (error) {
      if ((error as Error & { code?: string }).code === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      if (
        (error as Error & { code?: string }).code === "EMAIL_ALREADY_VERIFIED"
      ) {
        res.status(409).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'envoie du mail.",
        errors: { global: (error as Error).message },
      });

      return;
    }
  }

  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      let errors: Record<string, string> = {};

      if (!email || email === "") {
        errors["email"] = "L'email est requis.";
      }

      if (!password || password === "") {
        errors["password"] = "Le mot de passe est requis.";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json({
          success: false,
          errors,
        });
        return;
      }

      const user = await AuthService.signIn(
        email,
        password,
        req.headers["user-agent"]
      );

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      const errorsCode = [
        "INVALID_CREDENTIALS",
        "ACCOUNT_DELETED",
        "EMAIL_NOT_VERIFIED",
      ];

      if (
        errorsCode.includes((error as Error & { code?: string }).code || "")
      ) {
        res.status(401).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la connexion.",
        errors: { global: (error as Error).message },
      });

      return;
    }
  }

  async discordSignIn(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;

      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user`);
      }

      const deviceInfo = req.headers["user-agent"] || "Discord OAuth";

      const { accessToken, refreshToken } = await AuthService.discordSignIn(
        user,
        deviceInfo
      );

      const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&provider=DISCORD`;

      res.redirect(redirectUrl);

      return;
    } catch (error) {
      console.error("❌ Erreur Discord callback:", error);

      res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);

      return;
    }
  }

  async discordLinkCallback(req: Request, res: Response): Promise<void> {
    const { FRONTEND_URL } = process.env;

    try {
      res.redirect(`${FRONTEND_URL}/settings?success=discord_linked`);
    } catch {
      res.redirect(`${FRONTEND_URL}/settings?error=discord_link_failed`);
    }
  }

  async loggedUser(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ user: req.user });

      return;
    } catch (error) {
      if ((error as Error & { code?: string }).code === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      if ((error as Error & { code?: string }).code === "ACCOUNT_DELETED") {
        res.status(410).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Une erreur est survenue lors de la récupération de l'utilisateur connecté.",
        errors: { global: (error as Error).message },
      });

      return;
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken || refreshToken === "") {
        res
          .status(401)
          .json({ success: false, message: "Refresh token manquant" });

        return;
      }

      const newTokens = await AuthService.refresh(
        refreshToken,
        req.headers["user-agent"]
      );

      res.status(200).json({
        success: true,
        tokens: newTokens,
      });
    } catch (error) {
      const errorsCode = [
        "INVALID_REFRESH_TOKEN",
        "USER_NOT_FOUND",
        "INVALID_OR_EXPIRED_REFRESH_TOKEN",
      ];

      if (
        errorsCode.includes((error as Error & { code?: string }).code || "")
      ) {
        res.status(403).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors du rafraîchissement du token.",
        errors: { global: (error as Error).message },
      });

      return;
    }
  }

  async signOut(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken || refreshToken === "") {
        res
          .status(401)
          .json({ success: false, message: "Refresh token manquant" });

        return;
      }

      const isLoggedOut = await AuthService.signOut(refreshToken);

      res.status(200).json({
        success: isLoggedOut,
      });

      return;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la déconnexion.",
        errors: { global: (error as Error).message },
      });

      return;
    }
  }

  async unlinkDiscord(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;

      await AuthService.unlinkDiscord(user);

      res.status(200).json({ success: true });
    } catch (error) {
      if ((error as Error & { code?: string }).code === "USER_NOT_FOUND") {
        res.status(404).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      if ((error as Error & { code?: string }).code === "PASSWORD_REQUIRED") {
        res.status(400).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message:
          "Une erreur est survenue lors de la déconnexion de votre compte discord.",
        errors: { global: (error as Error).message },
      });

      return;
    }
  }
}

export default new AuthController();
