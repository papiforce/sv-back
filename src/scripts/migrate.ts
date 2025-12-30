#!/usr/bin/env node

import MigrationRunner from "../database/migrationRunner";
import chalk from "chalk";

const args = process.argv.slice(2);
const command = args[0];
const migrationName = args[1];

async function main() {
  const runner = new MigrationRunner();

  try {
    await runner.connect();

    switch (command) {
      case "up":
        await runner.up();
        break;

      case "down":
        await runner.down();
        break;

      case "status":
        await runner.status();
        break;

      case "create":
        if (!migrationName) {
          console.error(chalk.red("✗ Nom de migration requis"));
          console.log(chalk.gray("Usage: yarn migrate create <nom>"));
          process.exit(1);
        }
        await runner.create(migrationName);
        break;

      default:
        console.log(chalk.bold("\n📖 Commandes disponibles:\n"));
        console.log(
          chalk.cyan("  yarn migrate up") +
            chalk.gray("      - Appliquer les migrations en attente")
        );
        console.log(
          chalk.cyan("  yarn migrate down") +
            chalk.gray("    - Annuler la dernière migration")
        );
        console.log(
          chalk.cyan("  yarn migrate status") +
            chalk.gray("  - Afficher l'état des migrations")
        );
        console.log(
          chalk.cyan("  yarn migrate create <nom>") +
            chalk.gray(" - Créer une nouvelle migration\n")
        );
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red("\n✗ Erreur:"), error);
    process.exit(1);
  } finally {
    await runner.disconnect();
  }
}

main();
