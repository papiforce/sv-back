import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils";

import { User, IUser } from "../models";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token manquant" });

    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub).select("-refreshTokens");

    if (!user) {
      res.status(401).json({ message: "Utilisateur introuvable" });

      return;
    }

    if (user.isDeleted) {
      res.status(403).json({
        message: "Compte supprimé",
      });

      return;
    }

    req.user = {
      id: user._id,
      email: user.email,
      roles: user.roles,
      username: user.username,
      description: user.description,
      profilePicture: user.profilePicture,
    };

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        message: "Access token expiré",
      });

      return;
    }

    if (error.name === "JsonWebTokenError") {
      res.status(403).json({
        message: "Access token invalide",
      });

      return;
    }

    res.status(403).json({ message: "Token invalide ou expiré" });

    return;
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;

    if (!user) {
      res.status(401).json({
        message: "Non authentifié",
      });
    }

    const hasRole = user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        message: "Permissions insuffisantes",
        required: allowedRoles,
        current: user.roles,
      });
    }

    return next();
  };
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub);

    if (user && !user.isDeleted) {
      req.user = {
        id: user._id,
        email: user.email,
        roles: user.roles,
        username: user.username,
      };
    }

    next();
  } catch {
    return next();
  }
};
