import { Express } from "express";

import { logger } from "../middlewares";

import AuthRoutes from "./AuthRoutes";
import CatalogRoutes from "./CatalogRoutes";
import WaitlistRoutes from "./WaitlistRoutes";

const routes = (app: Express) => {
  const API_ROUTE = "/api";

  logger(app);

  app.use(`${API_ROUTE}/auth`, AuthRoutes);
  app.use(`${API_ROUTE}/catalog`, CatalogRoutes);
  app.use(`${API_ROUTE}/waitlist`, WaitlistRoutes);
};

export default routes;
