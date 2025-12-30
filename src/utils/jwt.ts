import jwt from "jsonwebtoken";

const {
  JWT_SECRET = "your-super-secret-key-change-in-prod",
  JWT_REFRESH_SECRET = "your-refresh-secret",
  JWT_EXPIRES_IN = 900, // 15 minutes
  JWT_REFRESH_EXPIRES_IN = 604800, // 7 days
} = process.env;

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
}

export class JWTUtils {
  /**
   * Génère un access token
   */
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as unknown as number,
    });
  }

  /**
   * Génère un refresh token
   */
  static generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN as unknown as number,
    });
  }

  /**
   * Génère les deux tokens
   */
  static generateTokens(payload: JWTPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload.userId),
    };
  }

  /**
   * ✅ Calculer la date d'expiration du refresh token
   */
  static getRefreshTokenExpiration(): Date {
    const expiresInSeconds = parseInt(
      JWT_REFRESH_EXPIRES_IN as unknown as string,
      10
    );
    return new Date(Date.now() + expiresInSeconds * 1000);
  }

  /**
   * Vérifie un access token
   */
  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  }

  /**
   * Vérifie un refresh token
   */
  static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  }

  /**
   * Génère un token de vérification d'email
   */
  static generateEmailVerificationToken(userId: string): string {
    return jwt.sign({ userId, type: "email-verification" }, JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  /**
   * Vérifie un token de vérification d'email
   */
  static verifyEmailToken(token: string): { userId: string; type: string } {
    return jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
  }
}
