import { AuthService } from "@/services/AuthService";

/**
 * 🧹 Job de nettoyage de TOUS les tokens expirés
 * Nettoie :
 * - Refresh tokens expirés
 * - Tokens de vérification d'email expirés
 * - Tokens de reset de mot de passe expirés
 */
export const cleanExpiredTokens = async (): Promise<void> => {
  try {
    console.log("🧹 Démarrage du nettoyage des tokens expirés...");

    const result = await AuthService.cleanExpiredTokens();

    console.log(
      `✅ Nettoyage terminé avec succès:
      ├─ Refresh tokens: ${result.refreshTokens} utilisateur(s)
      ├─ Tokens email: ${result.emailVerificationTokens} utilisateur(s)
      ├─ Tokens reset: ${result.passwordResetTokens} utilisateur(s)
      └─ Total: ${result.totalModified} document(s) modifié(s)`
    );
  } catch (error) {
    console.error("   └─ Erreur lors du nettoyage des tokens : ", error);
    throw error;
  }
};
