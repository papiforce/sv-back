/**
 * 🔧 Génère un slug URL-friendly à partir d'un texte
 *
 * Transformations appliquées :
 * 1. Conversion en minuscules
 * 2. Normalisation des accents (é → e, à → a, etc.)
 * 3. Remplacement des apostrophes par des tirets
 * 4. Suppression des caractères spéciaux
 * 5. Remplacement des espaces par des tirets
 * 6. Suppression des tirets multiples
 * 7. Suppression des tirets aux extrémités
 *
 * @param text - Texte à transformer en slug
 * @returns Slug URL-friendly
 *
 * @example
 * ```typescript
 * slugify("L'Attaque des Titans") // "l-attaque-des-titans"
 * slugify("Hunter × Hunter")      // "hunter-hunter"
 * slugify("Café Enchanté")        // "cafe-enchante"
 * slugify("Dr. Stone!!")          // "dr-stone"
 * ```
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "-")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default slugify;
