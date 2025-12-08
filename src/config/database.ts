import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

export async function connectToDatabase() {
  try {
    await mongoose.connect(uri as string);

    console.log("Connecté à la base de données");
  } catch (error) {
    console.error("Erreur lors de la connexion à la base de données : ", error);

    process.exit(1);
  }
}

export function getDatabase() {
  return mongoose.connection.db;
}
