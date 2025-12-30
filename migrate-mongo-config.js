require("dotenv").config();

const config = {
  mongodb: {
    url: process.env.MONGODB_URI || "mongodb://localhost:27017",
    databaseName: process.env.MONGODB_DB_NAME || "scanverse-db",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  migrationsDir: "dist/database/migrations",
  changelogCollectionName: "migrations_changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};

module.exports = config;
