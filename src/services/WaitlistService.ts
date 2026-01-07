import WaitlistModel, { IWaitlist } from "@/models/WaitlistModel";

class WaitlistService {
  /**
   * Ajoute un email à la waitlist
   * @param email - L'email du prospect
   * @returns L'entrée créée dans la waitlist
   * @throws Error si l'email existe déjà ou est invalide
   */
  async add(email: string): Promise<IWaitlist> {
    try {
      // Normalisation de l'email
      const normalizedEmail = email.trim().toLowerCase();

      // Validation du format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        const error = new Error("Format d'email invalide");
        (error as Error & { code: string }).code = "INVALID_EMAIL";
        throw error;
      }

      // Vérification de l'existence de l'email
      const existingEmail = await WaitlistModel.findOne({
        email: normalizedEmail,
      }).lean();

      if (existingEmail) {
        const error = new Error(
          "Cet email est déjà inscrit sur la liste d'attente"
        );
        (error as Error & { code: string }).code = "EMAIL_ALREADY_EXISTS";
        throw error;
      }

      // Création de l'entrée dans la waitlist
      const waitlistEntry = await WaitlistModel.create({
        email: normalizedEmail,
      });

      return waitlistEntry;
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      // Gestion des erreurs MongoDB
      if ((error as any).code === 11000) {
        const err = new Error(
          "Cet email est déjà inscrit sur la liste d'attente"
        );
        (err as Error & { code: string }).code = "EMAIL_ALREADY_EXISTS";
        throw err;
      }

      // Erreur générique
      console.error("Erreur lors de l'ajout à la waitlist:", error);
      throw new Error("Erreur lors de l'ajout à la liste d'attente");
    }
  }

  /**
   * Récupère tous les emails de la waitlist avec pagination
   * @param page - Numéro de page (commence à 1)
   * @param limit - Nombre d'éléments par page
   * @returns Liste paginée des emails
   */
  async getAll(
    page: number = 1,
    limit: number = 50
  ): Promise<{
    data: IWaitlist[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      // Validation des paramètres
      const validPage = Math.max(1, page);
      const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items

      const skip = (validPage - 1) * validLimit;

      // Récupération des données avec pagination
      const [data, total] = await Promise.all([
        WaitlistModel.find()
          .select("-__v")
          .sort({ createdAt: -1 }) // Plus récents en premier
          .skip(skip)
          .limit(validLimit)
          .lean(),
        WaitlistModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / validLimit);

      return {
        data,
        total,
        page: validPage,
        limit: validLimit,
        totalPages,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération de la waitlist:", error);
      throw new Error("Erreur lors de la récupération de la liste d'attente");
    }
  }

  /**
   * Vérifie si un email existe dans la waitlist
   * @param email - L'email à vérifier
   * @returns true si l'email existe, false sinon
   */
  async exists(email: string): Promise<boolean> {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      const count = await WaitlistModel.countDocuments({
        email: normalizedEmail,
      });

      return count > 0;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email:", error);
      throw new Error("Erreur lors de la vérification de l'email");
    }
  }

  /**
   * Recherche un email dans la waitlist
   * @param email - L'email à rechercher
   * @returns L'entrée trouvée ou null
   */
  async findByEmail(email: string): Promise<IWaitlist | null> {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      const entry = await WaitlistModel.findOne({
        email: normalizedEmail,
      })
        .select("-__v")
        .lean();

      return entry;
    } catch (error) {
      console.error("Erreur lors de la recherche de l'email:", error);
      throw new Error("Erreur lors de la recherche de l'email");
    }
  }

  /**
   * Supprime un email de la waitlist
   * @param email - L'email à supprimer
   * @returns true si supprimé, false si non trouvé
   */
  async remove(email: string): Promise<boolean> {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      const result = await WaitlistModel.deleteOne({
        email: normalizedEmail,
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'email:", error);
      throw new Error("Erreur lors de la suppression de l'email");
    }
  }

  /**
   * Récupère les statistiques de la waitlist
   * @returns Statistiques complètes
   */
  async getStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    lastAdded?: IWaitlist;
  }> {
    try {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [total, today, thisWeek, thisMonth, lastAdded] = await Promise.all([
        WaitlistModel.countDocuments(),
        WaitlistModel.countDocuments({
          createdAt: { $gte: startOfDay },
        }),
        WaitlistModel.countDocuments({
          createdAt: { $gte: startOfWeek },
        }),
        WaitlistModel.countDocuments({
          createdAt: { $gte: startOfMonth },
        }),
        WaitlistModel.findOne().select("-__v").sort({ createdAt: -1 }).lean(),
      ]);

      return {
        total,
        today,
        thisWeek,
        thisMonth,
        lastAdded: lastAdded || undefined,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw new Error("Erreur lors de la récupération des statistiques");
    }
  }

  /**
   * Exporte tous les emails (pour envoi de newsletters, etc.)
   * @returns Array de tous les emails
   */
  async exportEmails(): Promise<string[]> {
    try {
      const entries = await WaitlistModel.find().select("email -_id").lean();

      return entries.map((entry: Pick<IWaitlist, "email">) => entry.email);
    } catch (error) {
      console.error("Erreur lors de l'export des emails:", error);
      throw new Error("Erreur lors de l'export des emails");
    }
  }

  /**
   * Supprime tous les emails de la waitlist (USE WITH CAUTION!)
   * @returns Nombre d'emails supprimés
   */
  async clearAll(): Promise<number> {
    try {
      const result = await WaitlistModel.deleteMany({});

      console.warn(
        `⚠️ WAITLIST CLEARED: ${result.deletedCount} emails supprimés`
      );

      return result.deletedCount;
    } catch (error) {
      console.error("Erreur lors de la suppression de la waitlist:", error);
      throw new Error("Erreur lors de la suppression de la waitlist");
    }
  }

  /**
   * Recherche des emails par pattern (pour l'admin)
   * @param pattern - Pattern de recherche (ex: "@gmail.com")
   * @returns Emails correspondants
   */
  async searchByPattern(pattern: string): Promise<IWaitlist[]> {
    try {
      const regex = new RegExp(pattern, "i"); // Case insensitive

      const entries = await WaitlistModel.find({
        email: { $regex: regex },
      })
        .select("-__v")
        .sort({ createdAt: -1 })
        .lean();

      return entries;
    } catch (error) {
      console.error("Erreur lors de la recherche par pattern:", error);
      throw new Error("Erreur lors de la recherche");
    }
  }

  /**
   * Import en masse d'emails (pour migration)
   * @param emails - Array d'emails à importer
   * @returns Résultat de l'import
   */
  async bulkImport(emails: string[]): Promise<{
    imported: number;
    duplicates: number;
    errors: string[];
  }> {
    try {
      const results = {
        imported: 0,
        duplicates: 0,
        errors: [] as string[],
      };

      for (const email of emails) {
        try {
          await this.add(email);
          results.imported++;
        } catch (error) {
          const err = error as Error & { code?: string };
          if (err.code === "EMAIL_ALREADY_EXISTS") {
            results.duplicates++;
          } else {
            results.errors.push(`${email}: ${err.message}`);
          }
        }
      }

      return results;
    } catch (error) {
      console.error("Erreur lors de l'import en masse:", error);
      throw new Error("Erreur lors de l'import en masse");
    }
  }
}

export default new WaitlistService();
