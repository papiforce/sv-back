import mongoose, { Schema, Document, Model } from "mongoose";

import { ICatalog } from "./CatalogModel";
import { IUser } from "./UserModel";

// ✅ Interface TypeScript
export interface IChapter extends Document {
  catalogId: mongoose.Types.ObjectId | ICatalog; // Référence au manga
  chapterNumber: number; // Numéro du chapitre (ex: 1, 2, 3...)
  title?: string; // Titre du chapitre (optionnel)
  releaseDate: Date; // Date de sortie officielle
  isVolume: boolean;
  addedBy?: mongoose.Types.ObjectId | IUser; // Référence de l'utilisateur

  // ✅ Analytics
  readCount: number; // Nombre de lectures

  // ✅ Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Schéma Mongoose
const ChapterSchema = new Schema<IChapter>(
  {
    catalogId: {
      type: Schema.Types.ObjectId,
      ref: "Catalog",
      required: [true, "L'ID du manga est requis"],
      index: true, // ✅ Index pour récupérer tous les chapitres d'un manga
    },
    chapterNumber: {
      type: Number,
      required: [true, "Le numéro du chapitre est requis"],
      min: [0, "Le numéro du chapitre ne peut pas être négatif"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    releaseDate: {
      type: Date,
      required: [true, "La date de sortie est requise"],
      index: true, // ✅ Index pour trier par date
    },
    isVolume: {
      type: Boolean,
      required: [true, "Précisez si c'est un chapitre ou un volume"],
      default: false,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    readCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "chapters",
  }
);

// ✅ Index composés
ChapterSchema.index({ catalogId: 1, chapterNumber: 1 }, { unique: true }); // Un chapitre unique par manga
ChapterSchema.index({ catalogId: 1, releaseDate: -1 }); // Chapitres triés par date
ChapterSchema.index({ isPublished: 1, publishedAt: -1 }); // Derniers chapitres publiés

// ✅ Hook post-save : Mettre à jour le Catalog
// ChapterSchema.post("save", async function () {
//   const CatalogModel = mongoose.model("Catalog");

//   await CatalogModel.findByIdAndUpdate(this.catalogId, {
//     $max: {
//       latestChapterNumber: this.chapterNumber,
//       latestChapterDate: this.releaseDate,
//     }, // Maj du dernier chapitre
//     $inc: { totalChapters: 1 }, // Incrémenter le total (à gérer avec précaution)
//   });
// });

// ✅ Méthode pour incrémenter les vues
ChapterSchema.methods.incrementViews = async function (): Promise<void> {
  this.readCount += 1;
  await this.save();
};

export const ChapterModel: Model<IChapter> = mongoose.model<IChapter>(
  "Chapter",
  ChapterSchema
);
