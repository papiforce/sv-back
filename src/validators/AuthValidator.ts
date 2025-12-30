import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Le nom d'utilisateur doit contenir entre 3 et 30 caractères")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores"
    ),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Adresse email invalide")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .matches(/[A-Z]/)
    .withMessage("Le mot de passe doit contenir au moins une majuscule")
    .matches(/[a-z]/)
    .withMessage("Le mot de passe doit contenir au moins une minuscule")
    .matches(/[0-9]/)
    .withMessage("Le mot de passe doit contenir au moins un chiffre")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Le mot de passe doit contenir au moins un caractère spécial"),

  body("referredBy")
    .optional()
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Le code de parrainage doit contenir 6 caractères")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("Code de parrainage invalide"),
];

export const verifyEmailValidator = [
  body("token")
    .notEmpty()
    .withMessage("Token requis")
    .isString()
    .withMessage("Token invalide"),
];
