import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB_NAME || "scanverse-db";
const MIGRATIONS_COLLECTION = "migrations_changelog";

interface MigrationRecord {
  fileName: string;
  appliedAt: Date;
  version: string;
}

class MigrationRunner {
  private client: MongoClient;
  private migrationsPath: string;

  constructor() {
    this.client = new MongoClient(MONGODB_URI);
    this.migrationsPath = path.join(__dirname, "migrations");
  }

  async connect(): Promise<void> {
    await this.client.connect();
    console.log(chalk.green("✓ Connecté à MongoDB"));
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    console.log(chalk.green("✓ Déconnexion de MongoDB"));
  }

  private get db() {
    return this.client.db(DB_NAME);
  }

  private get migrationsCollection() {
    return this.db.collection<MigrationRecord>(MIGRATIONS_COLLECTION);
  }

  async getAppliedMigrations(): Promise<string[]> {
    const migrations = await this.migrationsCollection
      .find({})
      .sort({ appliedAt: 1 })
      .toArray();

    return migrations.map((m) => m.fileName);
  }

  async getPendingMigrations(): Promise<string[]> {
    const files = await fs.readdir(this.migrationsPath);
    const migrationFiles = files
      .filter((f) => f.endsWith(".js") || f.endsWith(".ts"))
      .sort();

    const applied = await this.getAppliedMigrations();
    return migrationFiles.filter((f) => !applied.includes(f));
  }

  async up(): Promise<void> {
    const pending = await this.getPendingMigrations();

    if (pending.length === 0) {
      console.log(chalk.yellow("⚠ Aucune migration en attente"));
      return;
    }

    console.log(chalk.blue(`📦 ${pending.length} migration(s) à appliquer\n`));

    for (const fileName of pending) {
      await this.applyMigration(fileName);
    }

    console.log(chalk.green("\n✅ Toutes les migrations ont été appliquées"));
  }

  private async applyMigration(fileName: string): Promise<void> {
    const filePath = path.join(this.migrationsPath, fileName);
    const migration = require(filePath);

    try {
      console.log(chalk.cyan(`⏳ Application de: ${fileName}`));

      await migration.up(this.db, this.client);

      await this.migrationsCollection.insertOne({
        fileName,
        appliedAt: new Date(),
        version: this.extractVersion(fileName),
      });

      console.log(chalk.green(`✓ ${fileName} appliquée avec succès`));
    } catch (error) {
      console.error(
        chalk.red(`✗ Erreur lors de l'application de ${fileName}:`)
      );
      console.error(error);
      throw error;
    }
  }

  async down(): Promise<void> {
    const applied = await this.getAppliedMigrations();

    if (applied.length === 0) {
      console.log(chalk.yellow("⚠ Aucune migration à annuler"));
      return;
    }

    const lastMigration = applied[applied.length - 1];

    if (!lastMigration) {
      console.log(chalk.yellow("⚠ Aucune migration à annuler"));
      return;
    }

    await this.rollbackMigration(lastMigration);

    console.log(chalk.green("\n✅ Migration annulée avec succès"));
  }

  private async rollbackMigration(fileName: string): Promise<void> {
    const filePath = path.join(this.migrationsPath, fileName);
    const migration = require(filePath);

    try {
      console.log(chalk.cyan(`⏳ Annulation de: ${fileName}`));

      await migration.down(this.db, this.client);

      await this.migrationsCollection.deleteOne({ fileName });

      console.log(chalk.green(`✓ ${fileName} annulée avec succès`));
    } catch (error) {
      console.error(chalk.red(`✗ Erreur lors de l'annulation de ${fileName}:`));
      console.error(error);
      throw error;
    }
  }

  async status(): Promise<void> {
    const applied = await this.getAppliedMigrations();
    const pending = await this.getPendingMigrations();

    console.log(chalk.bold("\n📊 État des migrations:\n"));

    console.log(chalk.green(`✓ Migrations appliquées: ${applied.length}`));
    applied.forEach((m) => console.log(chalk.gray(`  - ${m}`)));

    console.log(chalk.yellow(`\n⏳ Migrations en attente: ${pending.length}`));
    pending.forEach((m) => console.log(chalk.gray(`  - ${m}`)));
  }

  private extractVersion(fileName: string): string {
    const match = fileName.match(/^(\d+)-/);
    return match?.[1] ?? "unknown";
  }

  async create(name: string): Promise<void> {
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, 14);
    const fileName = `${timestamp}-${name}.ts`;
    const filePath = path.join(this.migrationsPath, fileName);

    const template = `import { Db, MongoClient } from "mongodb";

/**
 * Migration: ${name}
 * Created: ${new Date().toISOString()}
 */

export async function up(db: Db, client: MongoClient): Promise<void> {
  // Écrire votre migration ici
  console.log("Migration ${name} - UP");
  
  // Exemple:
  // await db.collection("users").updateMany({}, { $set: { newField: "value" } });
}

export async function down(db: Db, client: MongoClient): Promise<void> {
  // Annuler votre migration ici
  console.log("Migration ${name} - DOWN");
  
  // Exemple:
  // await db.collection("users").updateMany({}, { $unset: { newField: "" } });
}
`;

    await fs.writeFile(filePath, template, "utf-8");
    console.log(chalk.green(`✓ Migration créée: ${fileName}`));
  }
}

export default MigrationRunner;
