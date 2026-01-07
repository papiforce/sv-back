import { Application, Request, Response } from "express";
import WaitlistRoutes from "./WaitlistRoutes";
import AuthRoutes from "./AuthRoutes";

/**
 * Configuration centrale des routes de l'application
 * @param app - Instance Express
 * @param isDatabaseConnected - Indique si la base de données est connectée
 * @param environment - Environnement d'exécution (development, production, etc.)
 */
const routes = (
  app: Application,
  isDatabaseConnected: boolean,
  environment: string
): void => {
  const API_VERSION = "v1";
  const API_ROUTE = `/api/${API_VERSION}`;

  // ====================================
  // ROUTES DE L'API
  // ====================================

  /**
   * @route /api/v1/waitlist
   * @desc Gestion de la liste d'attente
   */
  app.use(`${API_ROUTE}/waitlist`, WaitlistRoutes);

  /**
   * @route /api/v1/auth
   * @desc Gestion de l'authentification et des utilisateurs
   */
  app.use(`${API_ROUTE}/auth`, AuthRoutes);

  // ====================================
  // ROUTE DE SANTÉ (HEALTH CHECK)
  // ====================================

  /**
   * @route GET /api/v1/health
   * @desc Vérifie que l'API est opérationnelle
   * @access Public
   */
  app.get(`${API_ROUTE}/health`, (req: Request, res: Response) => {
    res.status(isDatabaseConnected ? 200 : 503).json({
      success: true,
      message: "API opérationnelle",
      timestamp: new Date().toISOString(),
      version: API_VERSION,
      uptime: process.uptime(),
      database: isDatabaseConnected ? "connected" : "disconnected",
      environment,
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
    });
  });

  /**
   * @route GET /
   * @desc Route racine - Redirection vers la documentation
   * @access Public
   */
  app.get("/", (res: Response) => {
    res.status(200).json({
      success: true,
      message: "Bienvenue sur l'API",
      version: API_VERSION,
    });
  });

  // ====================================
  // GESTION DES ROUTES NON TROUVÉES
  // ====================================

  /**
   * @route * (404)
   * @desc Gestion des routes inexistantes
   */
  app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "Route non trouvée",
      path: req.originalUrl,
      method: req.method,
    });
  });
};

export default routes;
