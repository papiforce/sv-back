import mongoose, { Schema, Document, Model } from "mongoose";

import slugify from "@/utils/slugify";

// ✅ Types d'œuvres
export enum WorkType {
  MANGA = "MANGA",
  MANHWA = "MANHWA",
  MANHUA = "MANHUA",
}

// ✅ Lignes éditoriales
export enum EditorialLine {
  SHONEN = "SHONEN",
  SEINEN = "SEINEN",
  SHOJO = "SHOJO",
}

// ✅ Statuts de publication
export enum PublicationStatus {
  ONGOING = "ONGOING", // En cours
  COMPLETED = "COMPLETED", // Terminé
  HIATUS = "HIATUS", // En pause
  CANCELLED = "CANCELLED", // Annulé
}

// ✅ Interface TypeScript
export interface ICatalog extends Document {
  title: string;
  slug: string; // URL-friendly (ex: "one-piece")
  author: string;
  artist?: string; // Dessinateur (peut être différent de l'auteur)
  synopsis: string;
  tags: string[]; // ["action", "aventure", "comédie"]
  coverImage: string; // URL de l'image
  releaseYear: number;
  status: PublicationStatus;
  type: WorkType;
  editorialLine: EditorialLine;

  // ✅ Statistiques (dénormalisées pour la performance)
  totalChapters: number; // Nombre total de chapitres
  latestChapterNumber: number; // Dernier chapitre publié
  latestChapterDate?: Date; // Date du dernier chapitre

  // ✅ Analytics
  viewCount: number; // Nombre de vues
  bookmarkCount: number; // Nombre de bookmarks
  rating?: number; // Note moyenne (0-5)
  ratingCount?: number; // Nombre de notes

  // ✅ Métadonnées
  isActive: boolean; // Actif sur la plateforme
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Schéma Mongoose
const CatalogSchema = new Schema<ICatalog>(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // ✅ Index pour les recherches par URL
    },
    author: {
      type: String,
      required: [true, "L'auteur est requis"],
      trim: true,
      maxlength: [
        100,
        "Le nom de l'auteur ne peut pas dépasser 100 caractères",
      ],
    },
    artist: {
      type: String,
      trim: true,
      maxlength: [
        100,
        "Le nom du dessinateur ne peut pas dépasser 100 caractères",
      ],
    },
    synopsis: {
      type: String,
      required: [true, "Le synopsis est requis"],
      trim: true,
      maxlength: [2000, "Le synopsis ne peut pas dépasser 2000 caractères"],
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: function (tags: string[]) {
          return tags.length > 0 && tags.length <= 20;
        },
        message: "Il doit y avoir entre 1 et 20 tags",
      },
      index: true, // ✅ Index pour les recherches par tags
    },
    coverImage: {
      type: String,
      required: [true, "L'image de couverture est requise"],
      trim: true,
    },
    releaseYear: {
      type: Number,
      required: [true, "L'année de sortie est requise"],
      min: [1900, "L'année de sortie ne peut pas être antérieure à 1900"],
      max: [
        new Date().getFullYear() + 1,
        "L'année de sortie ne peut pas être dans le futur",
      ],
    },
    status: {
      type: String,
      enum: Object.values(PublicationStatus),
      required: true,
      default: PublicationStatus.ONGOING,
      index: true, // ✅ Index pour filtrer par statut
    },
    type: {
      type: String,
      enum: Object.values(WorkType),
      required: true,
      index: true, // ✅ Index pour filtrer par type
    },
    editorialLine: {
      type: String,
      enum: Object.values(EditorialLine),
      required: true,
      index: true, // ✅ Index pour filtrer par ligne éditoriale
    },
    totalChapters: {
      type: Number,
      default: 0,
      min: 0,
    },
    latestChapterNumber: {
      type: Number,
      default: 0,
      min: 0,
    },
    latestChapterDate: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true, // ✅ Index pour filtrer les œuvres actives
    },
  },
  {
    timestamps: true, // createdAt, updatedAt automatiques
    collection: "catalogs",
  }
);

// ✅ Index composés pour les recherches complexes
CatalogSchema.index({ title: "text", synopsis: "text" }); // Recherche full-text
CatalogSchema.index({ type: 1, editorialLine: 1, status: 1 }); // Filtres combinés
CatalogSchema.index({ viewCount: -1 }); // Top mangas
CatalogSchema.index({ rating: -1, ratingCount: -1 }); // Meilleurs mangas
CatalogSchema.index({ latestChapterDate: -1 }); // Dernières sorties

// ✅ Méthode pour générer un slug automatiquement
CatalogSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title);
  }
  next();
});

// ✅ Méthode pour incrémenter les vues
CatalogSchema.methods.incrementViews = async function (): Promise<void> {
  this.viewCount += 1;
  await this.save();
};

// ✅ Méthode statique pour rechercher
CatalogSchema.statics.searchByTitle = async function (
  query: string
): Promise<ICatalog[]> {
  return this.find({
    $text: { $search: query },
    isActive: true,
  })
    .limit(20)
    .sort({ score: { $meta: "textScore" } });
};

const CatalogModel: Model<ICatalog> = mongoose.model<ICatalog>(
  "Catalog",
  CatalogSchema
);

export default CatalogModel;
