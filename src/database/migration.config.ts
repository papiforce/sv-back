import { Db, MongoClient } from "mongodb";

export interface MigrationContext {
  db: Db;
  client: MongoClient;
}

export interface Migration {
  up(db: Db, client: MongoClient): Promise<void>;
  down(db: Db, client: MongoClient): Promise<void>;
}

export const createMigration = (migration: Migration) => migration;
