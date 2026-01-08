import CatalogModel, { ICatalog, EditorialLine } from "@/models/CatalogModel";
import { ChapterModel } from "@/models/ChapterModel";

import {
  isMangaExistingInSushiscan,
  getDataFromSushiscan,
} from "@/scripts/website/sushiscan";

export interface AddMangaDTO {
  editorialLine: EditorialLine;
  title: string;
}

export interface GetAllCatalogDTO {
  page: number;
  limit: number;
}

export class CatalogService {
  /**
   * Ajoute un manga au catalogue en le scrapant depuis Sushiscan
   */
  static async addMangaFromSushiscan(data: AddMangaDTO): Promise<ICatalog> {
    try {
      const { editorialLine, title } = data;

      const existingManga = await CatalogModel.findOne({ title });
      if (existingManga) {
        const error = new Error("Ce manga existe déjà dans le catalogue");
        (error as Error & { code?: string }).code = "MANGA_ALREADY_EXIST";
        throw error;
      }

      const existingMangaInSushiscan = await isMangaExistingInSushiscan(title);

      if (!existingMangaInSushiscan) {
        const error = new Error(
          "Ce manga n'est pas disponible chez notre provider"
        );
        (error as Error & { code?: string }).code = "NOT_FOUND_IN_SUSHISCAN";
        throw error;
      }

      const { chapters, ...dataFromSushiscan } = await getDataFromSushiscan(
        title,
        editorialLine
      );

      const manga: ICatalog = new CatalogModel(dataFromSushiscan);

      await manga.save();

      const mangaId = manga._id;

      if (chapters && chapters.length > 0) {
        const existingChapters = await ChapterModel.find(
          { _id: mangaId },
          { chapterNumber: 1 }
        ).lean();

        const existingNumbers = new Set(
          existingChapters.map((ch) => ch.chapterNumber)
        );

        const newChapters = chapters
          .filter((ch: any) => !existingNumbers.has(ch.chapterNumber))
          .map((ch: any) => ({
            catalogId: mangaId,
            chapterNumber: ch.chapterNumber,
            releaseDate: new Date(ch.releaseDate),
            readCount: 0,
          }));

        await ChapterModel.insertMany(newChapters, { ordered: false });
      }

      return manga;
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur lors de l'ajout du manga :", error);
      throw new Error("Erreur lors de l'ajout du manga");
    }
  }

  /**
   * Récupère le catalogue par page de 20
   */
  static async getAllCatalog(
    data: GetAllCatalogDTO
  ): Promise<{ catalog: Partial<ICatalog[]>; total: number; pages: number }> {
    const { page = 1, limit = 20 } = data;
    const skip = (page - 1) * limit;

    const [catalog, total] = await Promise.all([
      CatalogModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CatalogModel.countDocuments(),
    ]);

    const sanitizedCatalog = catalog.map((elem) => ({
      _id: elem._id,
      title: elem.title,
      slug: elem.slug,
      coverImage: elem.coverImage,
      status: elem.status,
      latestChapterNumber: elem.latestChapterNumber,
    })) as ICatalog[];

    return {
      catalog: sanitizedCatalog,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Récupère une œuvre par son slug
   */
  static async getMangaBySlug(slug: string) {
    const manga = await CatalogModel.findOne({ slug }).lean();

    if (!manga) {
      const error = new Error("Œuvre non trouvée");
      (error as Error & { code?: string }).code = "MANGA_NOT_FOUND";
      throw error;
    }

    return manga;
  }
}
