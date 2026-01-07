import mongoose from "mongoose";
import chalk from "chalk";

import "../models"; // Ceci charge tous les modèles
import UserModel from "../models/UserModel";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/scanverse-db";

async function seed() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log(chalk.green("✓ Connecté à MongoDB"));

    // Vérifier si le founder existe déjà
    const existingFounder = await UserModel.findOne({
      email: "kasomo.emm@gmail.com",
    });

    if (existingFounder) {
      console.log(chalk.yellow("⚠ Le founder existe déjà"));
      console.log(
        chalk.cyan(`  Code de parrainage: ${existingFounder.referralCode}`)
      );
      return;
    }

    // Créer un utilisateur FOUNDER
    const founder = await UserModel.create({
      username: "realbourbon",
      email: "kasomo.emm@gmail.com",
      password: "#K31L42011",
      roles: ["FOUNDER", "MEMBER"],
      profilePicture:
        "https://i.pinimg.com/1200x/85/c1/b9/85c1b9c85c2e8c4fa573efd6807b1794.jpg",
      referralCode: "KV99RB",
      accountStatus: "ACTIVE",
      emailVerified: true,
      emailVerifiedAt: new Date(),
    });

    console.log(chalk.green(`✓ Founder créé: ${founder.email}`));
    console.log(chalk.cyan(`  Code de parrainage: ${founder.referralCode}`));
    console.log(chalk.gray(`  ID: ${founder._id}`));
  } catch (error) {
    console.error(chalk.red("✗ Erreur:"), error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log(chalk.green("✓ Déconnexion"));
  }
}

seed();
