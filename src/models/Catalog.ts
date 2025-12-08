import { Schema, Document, model } from "mongoose";

import { ProviderType } from "../types";

export interface ICatalog extends Document {
  providers: ProviderType[];
  name: string;
  slugs: {
    provider: ProviderType;
    slug: string;
  }[];
  editorialLine: string;
  covers: {
    provider: ProviderType;
    cover: string;
  }[];
  synopsis: {
    provider: ProviderType;
    synopsis: string;
  }[];
  tags: {
    provider: ProviderType;
    tags: string[];
  }[];
  chapters: {
    provider: ProviderType;
    firstChapter: {
      number: number;
      url: string;
    };
    lastChapter: {
      number: number;
      url: string;
    };
  }[];
  status: string;
  type: string;
  year: string;
  author: string;
  artist: string;
}

const CatalogSchema: Schema = new Schema(
  {
    providers: {
      type: [String],
      required: true,
      enum: ["LELMANGA", "SUSHISCAN"],
      default: ["LELMANGA"],
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slugs: [
      {
        provider: {
          type: String,
          required: true,
          enum: ["LELMANGA", "SUSHISCAN"],
        },
        slug: {
          type: String,
          required: true,
        },
      },
    ],
    editorialLine: {
      type: String,
      required: true,
      enum: ["SHONEN", "SEINEN", "SHOJO"],
    },
    covers: [
      {
        provider: {
          type: String,
          required: true,
          enum: ["LELMANGA", "SUSHISCAN"],
        },
        cover: {
          type: String,
          required: true,
        },
      },
    ],
    synopsis: [
      {
        provider: {
          type: String,
          required: true,
          enum: ["LELMANGA", "SUSHISCAN"],
        },
        synopsis: {
          type: String,
          required: true,
        },
      },
    ],
    tags: [
      {
        provider: {
          type: String,
          required: true,
          enum: ["LELMANGA", "SUSHISCAN"],
        },
        tags: {
          type: [String],
          required: true,
        },
      },
    ],
    chapters: [
      {
        provider: {
          type: String,
          required: true,
          enum: ["LELMANGA", "SUSHISCAN"],
        },
        firstChapter: {
          number: { type: Number, required: true },
          url: { type: String, required: true },
        },
        lastChapter: {
          number: { type: Number, required: true },
          url: { type: String, required: true },
        },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["ONGOING", "COMPLETED"],
      default: "ONGOING",
    },
    type: {
      type: String,
      required: true,
      enum: ["MANGA", "MANHWA", "MANHUA"],
      default: "MANGA",
    },
    year: {
      type: String,
      required: false,
      default: null,
    },
    author: {
      type: String,
      required: false,
      default: null,
    },
    artist: {
      type: String,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<ICatalog>("Catalog", CatalogSchema);
