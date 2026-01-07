import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("❌ Erreur:", error);

  // Erreurs Mongoose
  if (error.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: "Erreur de validation",
      errors: error.message,
    });
    return;
  }

  // Erreurs MongoDB duplicates
  if (error.name === "MongoServerError" && (error as any).code === 11000) {
    res.status(400).json({
      success: false,
      message: "Cette ressource existe déjà",
    });
    return;
  }

  // Erreurs JWT
  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Token invalide",
    });
    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expiré",
    });
    return;
  }

  // Erreur générique
  res.status(500).json({
    success: false,
    message: error.message || "Erreur serveur interne",
  });
};
