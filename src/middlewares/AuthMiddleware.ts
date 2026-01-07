import { Request, Response, NextFunction } from "express";
import { JWTUtils } from "@/utils/jwt";

// ✅ Étendre le type Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        roles: string[];
        iat?: number; // Issued at (timestamp)
        exp?: number; // Expiration (timestamp)
      };
    }
  }
}

/**
 * Middleware d'authentification
 * Vérifie la présence et la validité du token JWT
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // ✅ 1. Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Token d'authentification manquant",
        code: "NO_TOKEN",
      });
      return;
    }

    // ✅ 2. Extraire le token (enlever "Bearer ")
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Token d'authentification invalide",
        code: "INVALID_TOKEN",
      });
      return;
    }

    // ✅ 3. Vérifier et décoder le token
    const decoded = JWTUtils.verifyAccessToken(token);

    // ✅ 4. Attacher les données utilisateur à la requête
    req.user = decoded;

    // ✅ 5. Passer au middleware suivant
    next();
  } catch (error: any) {
    console.error("Erreur d'authentification:", error.message);

    // ✅ Gestion des erreurs spécifiques JWT
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Token expiré",
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Token invalide",
        code: "INVALID_TOKEN",
      });
      return;
    }

    // ✅ Erreur générique
    res.status(401).json({
      success: false,
      message: "Authentification échouée",
      code: "AUTH_FAILED",
    });
  }
};

/**
 * Middleware pour vérifier les rôles
 * À utiliser après authMiddleware
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Non authentifié",
        code: "NOT_AUTHENTICATED",
      });
      return;
    }

    // ✅ Vérifier si l'utilisateur a au moins un des rôles requis
    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        success: false,
        message: "Accès refusé : permissions insuffisantes",
        code: "INSUFFICIENT_PERMISSIONS",
        requiredRoles: allowedRoles,
        userRoles: req.user.roles,
      });
      return;
    }

    next();
  };
};

/**
 * Middleware optionnel : authentification non obligatoire
 * Attache req.user si le token est valide, mais ne bloque pas la requête
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = JWTUtils.verifyAccessToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // ✅ En cas d'erreur, on continue quand même (auth optionnelle)
    next();
  }
};
