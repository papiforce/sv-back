import { IUser } from "../models";

declare global {
  namespace Express {
    interface Request {
      user?: Partial<IUser>;
    }
  }
}

export type MangaType = "SHONEN" | "SEINEN" | "SHOJO";

export type ProviderType = "LELMANGA" | "SUSHISCAN";

export type FormattedCatalogType = {
  _id: any;
  name: string;
  provider: ProviderType;
  slug: string;
  editorialLine: string;
  cover: string;
  synopsis: string;
  tags: string[];
  chapters: {
    firstChapter: { number: number; url: string };
    lastChapter: { number: number; url: string };
  };
  status: string;
  type: string;
  year: string;
  author: string;
  artist: string;
};

export type UserRoleType = "FOUNDER" | "ADMIN" | "MODERATOR" | "MEMBER";

export type RefreshTokenType = {
  token: string;
  createdAt: Date;
  expiresAt: Date;
  deviceInfo?: string;
};
