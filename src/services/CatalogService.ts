import CatalogModel, { ICatalog, EditorialLine } from "@/models/CatalogModel";
import { ChapterModel, IChapter } from "@/models/ChapterModel";

import {
  isMangaExistingInSushiscan,
  getDataFromSushiscan,
  updateDataFromSushiscan,
} from "@/scripts/website/sushiscan";

export interface AddMangaDTO {
  editorialLine: EditorialLine;
  title: string;
  slug?: string;
}

export interface GetAllCatalogDTO {
  page: number;
  limit: number;
}

export interface GetBySlugDTO {
  slug: string;
  page: number;
  limit: number;
}

export class CatalogService {
  /**
   * Ajoute un manga au catalogue en le scrapant depuis Sushiscan
   */
  static async addMangaFromSushiscan(data: AddMangaDTO): Promise<ICatalog> {
    try {
      const { editorialLine, title, slug } = data;

      const existingManga = await CatalogModel.findOne({ title });
      if (existingManga) {
        const error = new Error("Ce manga existe déjà dans le catalogue");
        (error as Error & { code?: string }).code = "MANGA_ALREADY_EXIST";
        throw error;
      }

      const existingMangaInSushiscan = await isMangaExistingInSushiscan(
        title,
        slug
      );

      if (!existingMangaInSushiscan) {
        const error = new Error(
          "Ce manga n'est pas disponible chez notre provider"
        );
        (error as Error & { code?: string }).code = "NOT_FOUND_IN_SUSHISCAN";
        throw error;
      }

      const { chapters, ...dataFromSushiscan } = await getDataFromSushiscan(
        title,
        editorialLine,
        slug
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
            isVolume: ch.isVolume,
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
  static async getMangaBySlug(data: GetBySlugDTO) {
    const { slug, page = 1, limit = 20 } = data;
    const skip = (page - 1) * limit;

    const manga = await CatalogModel.findOne({ slug }).lean();

    if (!manga) {
      const error = new Error("Œuvre non trouvée");
      (error as Error & { code?: string }).code = "MANGA_NOT_FOUND";
      throw error;
    }

    const chapters = await ChapterModel.find({ catalogId: manga._id })
      .sort({ chapterNumber: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const sanitizedChapters = chapters.map((chapter) => ({
      chapterNumber: chapter.chapterNumber,
      releaseDate: chapter.releaseDate,
      isVolume: chapter.isVolume,
      readCount: chapter.readCount,
    }));

    return { manga, chapters: sanitizedChapters };
  }

  /**
   * Met à jour le catalogue
   */
  static async updateCatalog(): Promise<any> {
    try {
      const allMangas = await CatalogModel.find({}).lean();
      const stats = {
        success: 0,
        failed: 0,
        newChaptersAdded: 0,
        errors: [] as Array<{ slug: string; error: string }>,
      };

      // Diviser en chunks pour traiter par lots
      const chunks = CatalogService.chunkArray(allMangas, 3);

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async (manga) => {
            try {
              const scrapedData = await updateDataFromSushiscan(
                manga.slug,
                manga.latestChapterNumber || 0
              );

              if (scrapedData.chapters?.length) {
                await CatalogService.insertNewChapters(
                  manga._id as string,
                  scrapedData.chapters
                );
                stats.newChaptersAdded += scrapedData.chapters.length;
              }

              await CatalogModel.findByIdAndUpdate(manga._id, {
                ...scrapedData,
                updatedAt: new Date(),
              });

              stats.success++;
            } catch (error) {
              stats.failed++;
              stats.errors.push({
                slug: manga.slug,
                error: error instanceof Error ? error.message : "Unknown",
              });
            }
          })
        );

        // Pause entre chaque batch
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      return stats;
    } catch (error) {
      // Re-throw des erreurs métier
      if ((error as Error & { code?: string }).code) {
        throw error;
      }

      console.error("Erreur lors de la mise à jour du catalogue :", error);
      throw new Error("Erreur lors de la mise à jour du catalogue");
    }
  }

  /**
   * 🔀 Divise un array en chunks
   */
  private static chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 📚 Insère les nouveaux chapitres dans la collection Chapters
   *
   * @param catalogId - ID du manga
   * @param chapters - Array des nouveaux chapitres
   */
  private static async insertNewChapters(
    catalogId: string,
    chapters: Partial<IChapter>[]
  ): Promise<void> {
    if (!chapters || chapters.length === 0) return;

    // Préparer les documents à insérer
    const chaptersToInsert = chapters.map((ch) => ({
      catalogId,
      chapterNumber: ch.chapterNumber!,
      releaseDate: new Date(ch.releaseDate as Date) || new Date(),
      isVolume: ch.isVolume || false,
      readCount: 0,
    }));

    // Insertion avec gestion des doublons
    try {
      await ChapterModel.insertMany(chaptersToInsert, { ordered: false });
    } catch (error: any) {
      // Ignorer les erreurs de duplicate key (chapitres déjà existants)
      if (error.code !== 11000) {
        throw error;
      }
      console.warn(`⚠️ Certains chapitres existaient déjà`);
    }
  }
}
