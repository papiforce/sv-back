import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import {
  registerValidator,
  verifyEmailValidator,
} from "@/validators/AuthValidator";
import { validateRequest } from "../middlewares/validateRequest";

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
 * @route   POST /api/v1/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post("/login", AuthController.login);

export default router;
