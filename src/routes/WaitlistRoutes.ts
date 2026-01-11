import { Router } from "express";

import WaitlistController from "@/controllers/WaitlistController";

import { authMiddleware, requireRoles } from "@/middlewares/AuthMiddleware";

import { UserRole } from "@/models/UserModel";

const router = Router();

/**
 * @route   POST /api/v1/waitlist
 * @desc    Ajoute un email à la liste d'attente
 * @access  Public
 * @body    { email: string }
 */
router.post("/", WaitlistController.add);

/**
 * @route   GET /api/v1/waitlist
 * @desc    Récupère tous les emails de la waitlist (paginé)
 * @access  Private/Admin
 * @query   ?page=1&limit=50
 */
router.get(
  "/",
  authMiddleware,
  requireRoles(UserRole.FOUNDER, UserRole.ADMIN),
  WaitlistController.getAll
);

/**
 * @route   GET /api/v1/waitlist/stats
 * @desc    Récupère les statistiques de la waitlist
 * @access  Private/Admin
 */
router.get(
  "/stats",
  authMiddleware,
  requireRoles(UserRole.FOUNDER, UserRole.ADMIN),
  WaitlistController.getStats
);

/**
 * @route   GET /api/v1/waitlist/check/:email
 * @desc    Vérifie si un email existe dans la waitlist
 * @access  Public
 * @params  email
 */
router.get("/check/:email", WaitlistController.checkEmail);

/**
 * @route   DELETE /api/v1/waitlist/:email
 * @desc    Supprime un email de la waitlist
 * @access  Private/Admin
 * @params  email
 */
router.delete(
  "/:email",
  authMiddleware,
  requireRoles(UserRole.FOUNDER, UserRole.ADMIN),
  WaitlistController.remove
);

export default router;
