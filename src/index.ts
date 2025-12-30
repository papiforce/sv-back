import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import {
  connectToDatabase,
  disconnectFromDatabase,
  isDatabaseConnected,
} from "@/config/database";
import routes from "@/routes";
import { startJobs, stopJobs } from "@/jobs";

// Charger les variables d'environnement en premier
dotenv.config();

// Configuration
const PORT = parseInt(process.env.PORT || "4000", 10);
const NODE_ENV = process.env.NODE_ENV || "development";
const AUTHORIZED_ORIGINS = process.env.AUTHORIZED_ORIGINS
  ? process.env.AUTHORIZED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

// Validation des variables d'environnement critiques
function validateEnvironment(): void {
  const requiredEnvVars = [
    "MONGO_URI",
    "APP_NAME",
    "APP_URL",
    "SMTP_FROM",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_PORT",
    "FRONTEND_URL",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_EXPIRES_IN",
    "ENABLE_CLEAN_TOKENS_JOB",
  ];
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error("❌ Variables d'environnement manquantes:");
    missingEnvVars.forEach((envVar) => console.error(`   - ${envVar}`));
    process.exit(1);
  }

  if (!process.env.PORT) {
    console.warn("⚠️  PORT non défini, utilisation du port par défaut: 4000");
  }
}

// Configuration CORS
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    // Autoriser les requêtes sans origin (Postman, curl, apps mobiles)
    if (!origin) {
      return callback(null, true);
    }

    if (AUTHORIZED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 Origine refusée: ${origin}`);
      callback(new Error("Non autorisé par CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Initialisation de l'application Express
const app: Application = express();

// Middlewares de sécurité et performance
if (NODE_ENV === "production") {
  app.use(helmet()); // Sécurité HTTP headers
  app.use(compression()); // Compression Gzip
}

// Logging des requêtes (différent selon l'environnement)
if (NODE_ENV === "development") {
  app.use(morgan("dev")); // Format coloré et détaillé
} else {
  app.use(morgan("combined")); // Format Apache standard
}

// Middlewares principaux
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" })); // Limite la taille du body
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de gestion des erreurs (doit être en dernier)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Erreur non gérée:", err);

  res.status(500).json({
    error: "Erreur interne du serveur",
    message:
      NODE_ENV === "development" ? err.message : "Une erreur s'est produite",
    ...(NODE_ENV === "development" && { stack: err.stack }),
  });
});

/**
 * Démarre le serveur avec connexion à la base de données
 */
async function startServer(): Promise<void> {
  try {
    // Validation de l'environnement
    validateEnvironment();

    // Connexion à MongoDB
    await connectToDatabase();

    // ✅ Démarrer tous les cron jobs
    startJobs();

    // Routes de l'application
    routes(app, isDatabaseConnected(), NODE_ENV);

    // Démarrage du serveur HTTP
    const server = app.listen(PORT, () => {
      console.log("\n🚀 ========================================");
      console.log(`✅ Serveur démarré avec succès`);
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environnement: ${NODE_ENV}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`🌐 Origines autorisées: ${AUTHORIZED_ORIGINS.join(", ")}`);
      console.log("========================================\n");
    });

    // Gestion du timeout des requêtes
    server.timeout = 30000; // 30 secondes

    // Gestion propre de l'arrêt du serveur
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n⚠️  Signal ${signal} reçu, arrêt gracieux en cours...`);

      server.close(async () => {
        console.log("🔌 Serveur HTTP fermé");

        await disconnectFromDatabase();

        console.log("👋 Arrêt complet du serveur\n");
        process.exit(0);
      });

      // Forcer l'arrêt après 10 secondes
      setTimeout(() => {
        console.error("⏱️  Timeout atteint, arrêt forcé");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => {
      // Arrêter les cron jobs
      stopJobs();

      gracefulShutdown("SIGINT");
    });

    // Gestion des erreurs non capturées
    process.on("uncaughtException", (error: Error) => {
      console.error("❌ Exception non capturée:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason: unknown) => {
      console.error("❌ Promesse rejetée non gérée:", reason);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("❌ Erreur fatale au démarrage du serveur:", error);

    if (error instanceof Error) {
      console.error(`Message: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    }

    process.exit(1);
  }
}

// Démarrage du serveur
startServer();

export default app;
