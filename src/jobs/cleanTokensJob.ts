import { AuthService } from "../services/AuthService";

/**
 * Nettoie les refresh tokens expirés de la base de données
 */
export const cleanExpiredTokens = async (): Promise<void> => {
  try {
    await AuthService.cleanExpiredTokens();
    console.log("   └─ Tokens expirés supprimés avec succès");
  } catch (error) {
    console.error("   └─ Erreur lors du nettoyage des tokens:", error);
    throw error;
  }
};
