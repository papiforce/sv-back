import { Router } from "express";

import { AuthController } from "@/controllers/AuthController";

import { validateRequest } from "@/middlewares/validateRequest";
import { authMiddleware } from "@/middlewares/AuthMiddleware";

import {
  registerValidator,
  verifyEmailValidator,
  resetPasswordValidator,
} from "@/validators/AuthValidator";

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post(
  "/register",
  registerValidator,
  validateRequest,
  AuthController.register
);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Vérifier l'email avec le token
 * @access  Public
 */
router.post(
  "/verify-email",
  verifyEmailValidator,
  validateRequest,
  AuthController.verifyEmail
);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Renvoyer l'email de vérification
 * @access  Public
 */
router.post("/resend-verification", AuthController.resendVerificationEmail);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Demander une réinitialisation de mot de passe
 * @access  Public
 */
router.post("/forgot-password", AuthController.forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Réinitialiser le mot de passe
 * @access  Public
 */
router.post(
  "/reset-password",
  resetPasswordValidator,
  AuthController.resetPassword
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post("/login", AuthController.login);

/**
 * @route   GET /api/v1/auth/login
 * @desc    Récupérer les informations de l'utilisateur
 * @access  Private
 */
router.get("/profile", authMiddleware, AuthController.getProfile);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Rafraîchir l'access token
 * @access  Public (cookie requis)
 */
router.post("/refresh", AuthController.refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion d'un utilisateur
 * @access  Private
 */
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
