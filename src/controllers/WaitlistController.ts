import { Request, Response } from "express";

import WaitlistService from "@/services/WaitlistService";
import EmailService from "@/services/EmailService";

import waitlistEmail from "@/emails/waitlistEmail";

class WaitlistController {
  /**
   * Ajoute un email à la waitlist
   * @route POST /api/v1/waitlist
   */
  async add(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      // Validation de la présence de l'email
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email requis",
          errors: { email: "Le champ email est obligatoire" },
        });
        return;
      }

      // Validation basique du format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Format d'email invalide",
          errors: { email: "Veuillez fournir une adresse email valide" },
        });
        return;
      }

      // Ajout à la waitlist via le service
      const waitlistEntry = await WaitlistService.add(email);

      // Envoi de l'email de confirmation
      try {
        const emailContent = waitlistEmail();

        const emailResult = await EmailService.sendEmail({
          to: email,
          subject: "✨ Bienvenue sur la liste d'attente Scanverse !",
          html: emailContent,
        });

        if (!emailResult.success) {
          console.error(
            `⚠️ Email non envoyé pour ${email}:`,
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

      res.status(201).json({
        success: true,
        message: "Email ajouté à la liste d'attente avec succès",
        data: {
          email: waitlistEntry.email,
          createdAt: waitlistEntry.createdAt,
        },
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      // Gestion des erreurs métier
      if (err.code === "EMAIL_ALREADY_EXISTS") {
        res.status(409).json({
          success: false,
          message: "Cet email est déjà inscrit sur la liste d'attente",
          errors: { email: err.message },
        });
        return;
      }

      if (err.code === "INVALID_EMAIL") {
        res.status(400).json({
          success: false,
          message: "Format d'email invalide",
          errors: { email: err.message },
        });
        return;
      }

      // Erreur serveur générique
      console.error("Erreur lors de l'ajout à la waitlist:", err);
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'ajout à la liste d'attente",
        errors: { global: err.message },
      });
    }
  }

  /**
   * Récupère tous les emails de la waitlist (admin only)
   * @route GET /api/v1/waitlist
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 50 } = req.query;

      const result = await WaitlistService.getAll(Number(page), Number(limit));

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de la waitlist:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de la liste d'attente",
        errors: { global: (error as Error).message },
      });
    }
  }

  /**
   * Vérifie si un email existe dans la waitlist
   * @route GET /api/v1/waitlist/check/:email
   */
  async checkEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      // Validation de la présence de l'email
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email requis",
          errors: { email: "L'email est obligatoire" },
        });
        return;
      }

      const exists = await WaitlistService.exists(email);

      res.status(200).json({
        success: true,
        exists,
      });
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification de l'email",
        errors: { global: (error as Error).message },
      });
    }
  }

  /**
   * Supprime un email de la waitlist
   * @route DELETE /api/v1/waitlist/:email
   */
  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      // Validation de la présence de l'email
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email requis",
          errors: { email: "L'email est obligatoire" },
        });
        return;
      }

      const deleted = await WaitlistService.remove(email);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Email non trouvé dans la liste d'attente",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Email retiré de la liste d'attente avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'email:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de l'email",
        errors: { global: (error as Error).message },
      });
    }
  }

  /**
   * Récupère le nombre total d'inscrits
   * @route GET /api/v1/waitlist/stats
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await WaitlistService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des statistiques",
        errors: { global: (error as Error).message },
      });
    }
  }
}

export default new WaitlistController();
