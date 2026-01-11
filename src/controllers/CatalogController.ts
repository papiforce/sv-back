import { Request, Response } from "express";
import { CatalogService } from "@/services/CatalogService";
import { EditorialLine } from "@/models/CatalogModel";

export class CatalogController {
  /**
   * POST /api/v1/catalog/add
   * Ajoute un manga au catalogue en le scrapant depuis JapScan
   */
  static async addManga(req: Request, res: Response): Promise<void> {
    try {
      const { editorialLine, title, slug } = req.body;

      // Validation
      if (!editorialLine || !title) {
        res.status(400).json({
          success: false,
          message: "TLe titre et ligne éditoriale requis",
        });
        return;
      }

      if (!Object.values(EditorialLine).includes(editorialLine)) {
        res.status(400).json({
          success: false,
          message: `Type invalide. Ce doit être l'un d'entre eux : ${Object.values(
            EditorialLine
          ).join(", ")}`,
        });
        return;
      }

      // Scrape et ajoute au catalogue
      const manga = await CatalogService.addMangaFromSushiscan({
        editorialLine,
        title,
        slug,
      });

      res.status(201).json({
        success: true,
        message: "Manga ajouté au catalogue",
        data: manga,
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      if (err.code === "MANGA_ALREADY_EXIST") {
        res.status(400).json({
          success: false,
          message: "Ce manga existe déjà dans le catalogue",
          errors: { global: err.message },
        });
        return;
      }

      if (err.code === "NOT_FOUND_IN_SUSHISCAN") {
        res.status(404).json({
          success: false,
          message: "Ce manga n'est pas disponible chez notre provider",
          errors: { global: err.message },
        });
        return;
      }

      console.error("Erreur lors de l'ajout du manga :", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'ajout du manga",
        errors: { global: err.message },
      });
    }
  }

  /**
   * GET /api/v1/catalog
   * Récupère tous les mangas du catalogue (avec pagination)
   */
  static async getAllCatalog(req: Request, res: Response): Promise<void> {
    try {
      const { pageQuery, limitQuery } = req.query;

      const page = parseInt(pageQuery as string) || 1;
      const limit = parseInt(limitQuery as string) || 20;

      const { catalog, total, pages } = await CatalogService.getAllCatalog({
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: catalog,
        pagination: {
          page,
          limit,
          total: total,
          pages: pages,
        },
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      console.error("Erreur lors de la récupération du catalogue :", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du catalogue",
        errors: { global: err.message },
      });
    }
  }

  /**
   * GET /api/v1/catalog/:slug
   * Récupère un manga par son slug
   */
  static async getMangaBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const { pageQuery, limitQuery } = req.query;

      const page = parseInt(pageQuery as string) || 1;
      const limit = parseInt(limitQuery as string) || 20;

      if (!slug) {
        res.status(400).json({
          success: false,
          message: "Slug requis",
        });
        return;
      }

      const { manga, chapters } = await CatalogService.getMangaBySlug({
        slug,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: { manga, chapters },
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      console.error("Erreur lors de la récupération de l'œuvre :", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération de l'œuvre",
        errors: { global: err.message },
      });
    }
  }

  /**
   * PUT /api/v1/catalog
   * Mets à jour le catalogue
   */
  static async updateCatalog(req: Request, res: Response): Promise<void> {
    try {
      const stats = await CatalogService.updateCatalog();

      res.status(200).json({
        success: true,
        message: "Catalogue mis à jour avec succès",
        stats,
      });
    } catch (error) {
      const err = error as Error & { code?: string };

      console.error("Erreur lors de la mise à jour du catalogue :", err);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du catalogue",
        errors: { global: err.message },
      });
    }
  }
}
