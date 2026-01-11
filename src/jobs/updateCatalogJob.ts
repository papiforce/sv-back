import { CatalogService } from "@/services/CatalogService";

/**
 *    Job de mise à jour de TOUTES les œuvres
 * Met à jour :
 * - Cover
 * - Chapitres
 * - Autres infos (statut, type, année de sortie, auteur, dessinateur)
 */
export const updateCatalog = async (): Promise<void> => {
  try {
    console.log("🆕 Démarrage de la mise à jour du catalogue...");

    const stats = await CatalogService.updateCatalog();

    console.log(`✅ Mise à jour terminée:
      ├─ Réussies: ${stats.success} œuvre(s)
      ├─ Échouées: ${stats.failed} œuvre(s)
      ├─ Chapitres: ${stats.newChaptersAdded} ajouté(s)
      └─ Erreurs : ${stats.errors}`);
  } catch (error) {
    console.error("   └─ Erreur lors de la mise à jour du catalogue : ", error);
    throw error;
  }
};
