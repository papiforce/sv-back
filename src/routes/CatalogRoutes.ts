import { Router } from "express";

import { CatalogController } from "@/controllers/CatalogController";

import { authMiddleware, requireRoles } from "@/middlewares/AuthMiddleware";

const router = Router();

// ➕ Ajouter un manga (protégé - nécessite authentification)
/**
 * @route   GET /api/v1/auth/login
 * @desc    Ajouter un manga
 * @access  Private
 */
router.post(
  "/add",
  authMiddleware,
  requireRoles("FOUNDER", "ADMIN"),
  CatalogController.addManga
);

/**
 * @route   GET /api/v1/catalog
 * @desc    Lister tous les mangas
 * @access  Public
 */
router.get("/", CatalogController.getAllCatalog);

/**
 * @route   GET /api/v1/catalog/:slug
 * @desc    Récupérer un manga par slug
 * @access  Public
 */
router.get("/:slug", CatalogController.getMangaBySlug);

export default router;
