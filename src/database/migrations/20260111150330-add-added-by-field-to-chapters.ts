import { Db, MongoClient } from "mongodb";

/**
 * Migration: add-added-by-field-to-chapters
 * Created: 2026-01-11T15:03:30.226Z
 */

export async function up(db: Db, client: MongoClient): Promise<void> {
  console.log("🔄 Ajout du champ addedBy aux chapitres existants");

  // 1️⃣ Compter les chapitres concernés
  const totalChapters = await db.collection("chapters").countDocuments();
  const chaptersWithoutAddedBy = await db
    .collection("chapters")
    .countDocuments({
      addedBy: { $exists: false },
    });

  console.log(`📊 Statistiques:`);
  console.log(`   - Total chapitres: ${totalChapters}`);
  console.log(`   - À modifier: ${chaptersWithoutAddedBy}`);

  // 2️⃣ Mise à jour
  const result = await db
    .collection("chapters")
    .updateMany({ addedBy: { $exists: false } }, { $set: { addedBy: null } });

  console.log(`✅ ${result.modifiedCount} chapitres mis à jour`);

  // 3️⃣ Index
  await db.collection("chapters").createIndex({ addedBy: 1 });
  console.log("✅ Index créé sur addedBy");

  // 4️⃣ Vérification
  const verification = await db.collection("chapters").countDocuments({
    addedBy: { $exists: true },
  });
  console.log(
    `✅ Vérification: ${verification}/${totalChapters} chapitres ont le champ addedBy`
  );
}

export async function down(db: Db, client: MongoClient): Promise<void> {
  console.log("🔄 Suppression du champ addedBy des chapitres");

  const totalChapters = await db.collection("chapters").countDocuments();
  const chaptersWithAddedBy = await db.collection("chapters").countDocuments({
    addedBy: { $exists: true },
  });

  console.log(`📊 Statistiques:`);
  console.log(`   - Total chapitres: ${totalChapters}`);
  console.log(`   - À nettoyer: ${chaptersWithAddedBy}`);

  // Index
  try {
    await db.collection("chapters").dropIndex("addedBy_1");
    console.log("✅ Index supprimé");
  } catch (error) {
    console.log("ℹ️ Index n'existait pas");
  }

  // Champ
  const result = await db
    .collection("chapters")
    .updateMany({ addedBy: { $exists: true } }, { $unset: { addedBy: "" } });

  console.log(`✅ ${result.modifiedCount} chapitres nettoyés`);

  // Vérification
  const verification = await db.collection("chapters").countDocuments({
    addedBy: { $exists: true },
  });
  console.log(
    `✅ Vérification: ${verification} chapitres ont encore le champ (devrait être 0)`
  );
}
