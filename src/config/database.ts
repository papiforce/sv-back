import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV || "development";

// Configuration optimisée pour la production
const mongooseOptions: mongoose.ConnectOptions = {
  maxPoolSize: 10, // Nombre max de connexions simultanées
  minPoolSize: 2, // Garde au moins 2 connexions ouvertes
  serverSelectionTimeoutMS: 5000, // Timeout de 5s pour la sélection du serveur
  socketTimeoutMS: 45000, // Timeout de 45s pour les opérations socket
  family: 4, // Force IPv4
};

/**
 * Connecte l'application à MongoDB avec gestion d'erreurs avancée
 */
export async function connectToDatabase(): Promise<void> {
  if (!MONGODB_URI) {
    console.error(
      "❌ MONGODB_URI n'est pas défini dans les variables d'environnement"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);

    console.log(`✅ Connecté à MongoDB - Environnement: ${NODE_ENV}`);
    console.log(`📊 Base de données: ${mongoose.connection.name}`);

    // Gestion des événements de connexion
    mongoose.connection.on("error", (error) => {
      console.error("❌ Erreur MongoDB:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB déconnecté");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnecté");
    });

    // Fermeture propre lors de l'arrêt de l'application
    process.on("SIGINT", async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion à MongoDB:", error);

    if (error instanceof Error) {
      console.error(`Message: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    }

    process.exit(1);
  }
}

/**
 * Déconnecte proprement de MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    console.log("👋 Déconnecté de MongoDB");
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion:", error);
  }
}

/**
 * Retourne l'instance de la base de données MongoDB native
 * Utile pour des opérations avancées non couvertes par Mongoose
 */
export function getDatabase(): mongoose.mongo.Db {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB n'est pas connecté");
  }

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB database instance is unavailable");
  }

  return db;
}

/**
 * Vérifie si la connexion MongoDB est active
 */
export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Retourne le statut de la connexion
 */
export function getDatabaseStatus(): string {
  const states = ["déconnecté", "connecté", "en connexion", "en déconnexion"];
  return states[mongoose.connection.readyState] || "inconnu";
}
