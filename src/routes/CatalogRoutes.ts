import { Router } from "express";

import { CatalogController } from "@/controllers/CatalogController";

import { authMiddleware, requireRoles } from "@/middlewares/AuthMiddleware";

import { UserRole } from "@/models/UserModel";

const router = Router();

/**
 * @route   GET /api/v1/auth/login
 * @desc    Ajouter un manga
 * @access  Private
 */
router.post(
  "/add",
  authMiddleware,
  requireRoles(UserRole.FOUNDER, UserRole.ADMIN),
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

/**
 * @route   PUT /api/v1/catalog
 * @desc    Met à jour le catalogue
 * @access  Private
 */
router.put(
  "/",
  // authMiddleware,
  // requireRoles(UserRole.FOUNDER, UserRole.ADMIN),
  CatalogController.updateCatalog
);

export default router;
