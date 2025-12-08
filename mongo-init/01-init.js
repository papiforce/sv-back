print("🚀 === DEBUG INITIALISATION MONGODB ===");

// Debug des variables d'environnement
print("📋 Variables d'environnement:");
print('  MONGO_ROOT_USERNAME: "' + process.env.MONGO_ROOT_USERNAME + '"');
print(
  '  MONGO_ROOT_PASSWORD: "' +
    (process.env.MONGO_ROOT_PASSWORD ? "[DEFINIE]" : "[VIDE]") +
    '"'
);
print('  MONGO_DATABASE: "' + process.env.MONGO_DATABASE + '"');

// Vérification des variables critiques
const rootUser = process.env.MONGO_ROOT_USERNAME;
const rootPassword = process.env.MONGO_ROOT_PASSWORD;
const appDatabase = process.env.MONGO_DATABASE;
const appUser = process.env.MONGO_APP_USERNAME;
const appPassword = process.env.MONGO_APP_PASSWORD;

if (!rootUser || !rootPassword || !appDatabase || !appUser || !appPassword) {
  print("❌ ERREUR: Variables d'environnement manquantes !");
  print("   rootUser: " + (rootUser || "MANQUANT"));
  print("   rootPassword: " + (rootPassword ? "OK" : "MANQUANT"));
  print("   appDatabase: " + (appDatabase || "MANQUANT"));
  print("   appUser: " + (appUser || "MANQUANT"));
  print("   appPassword: " + (appPassword ? "OK" : "MANQUANT"));
  quit(1);
}

// Connexion admin
print("🔐 Connexion à la base admin...");
db = db.getSiblingDB("admin");

try {
  const authResult = db.auth(rootUser, rootPassword);
  if (!authResult) {
    print("❌ Échec authentification admin");
    quit(1);
  }
  print("✅ Authentification admin réussie");
} catch (error) {
  print("❌ Erreur authentification: " + error.message);
  quit(1);
}

// Création utilisateur avec format explicite
print("👤 Création utilisateur applicatif...");

const userDoc = {
  user: appUser,
  pwd: appPassword,
  roles: [
    {
      role: "readWrite",
      db: appDatabase,
    },
    {
      role: "dbAdmin",
      db: appDatabase,
    },
  ],
};

print("📝 Document utilisateur:");
print('   user: "' + userDoc.user + '"');
print("   pwd: [DEFINI]");
print("   roles: " + JSON.stringify(userDoc.roles, null, 2));

try {
  db.createUser(userDoc);
  print("✅ Utilisateur " + appUser + " créé avec succès dans admin");
} catch (error) {
  if (error.message && error.message.includes("already exists")) {
    print("⚠️ Utilisateur " + appUser + " existe déjà");
  } else {
    print("❌ Erreur création utilisateur: " + error.message);
    print("❌ Code erreur: " + (error.code || "N/A"));
    print("❌ Détails: " + JSON.stringify(error, null, 2));
  }
}

// Vérification de l'utilisateur créé
print("🔍 Vérification des utilisateurs dans admin:");
try {
  const users = db.getUsers();
  users.forEach(function (user) {
    print(
      "  👤 " +
        user.user +
        " - Rôles: " +
        JSON.stringify(user.roles.map((r) => r.role + "@" + r.db))
    );
  });
} catch (error) {
  print("❌ Erreur listage utilisateurs: " + error.message);
}

// Test de connexion
print("🧪 Test de connexion utilisateur applicatif...");
try {
  const testAuth = db.auth(appUser, appPassword);
  if (testAuth) {
    print("✅ Test authentification " + appUser + ": SUCCESS");

    // Basculer vers la base applicative
    db = db.getSiblingDB(appDatabase);
    print("📂 Bascule vers base: " + appDatabase);

    // Créer une collection de test
    db.test_init.insertOne({
      message: "Test initialisation",
      timestamp: new Date(),
      version: "1.0",
    });
    print("✅ Collection test_init créée");
  } else {
    print("❌ Test authentification app_user: FAILED");
  }
} catch (error) {
  print("❌ Erreur test connexion: " + error.message);
}

print("🏁 === FIN DEBUG INITIALISATION ===");
