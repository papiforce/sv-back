import { MangaType, ProviderType, FormattedCatalogType } from "../types";

import {
  isMangaExistingInLelmanga,
  getDataFromLelmanga,
  updateDataFromLelmanga,
  isMangaExistingInSushiscan,
  getDataFromSushiscan,
  updateDataFromSushiscan,
} from "../scripts";

import { Catalog, ICatalog } from "../models";
import { formatCatalogByProvider } from "../utils";

class CatalogService {
  static async get(
    id?: string,
    search?: string,
    orderBy?: string,
    provider?: ProviderType,
    limit?: number,
    page?: number
  ): Promise<{
    catalog: FormattedCatalogType[];
    total: number;
    pages: number;
  }> {
    const catalog = await Catalog.find({
      providers: provider,
      ...(id && { _id: id }),
      ...(search && {
        $or: [
          {
            name: search.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
              letter.toUpperCase()
            ),
          },
          {
            name: {
              $regex: search.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                letter.toUpperCase()
              ),
              $options: "i",
            },
          },
        ],
      }),
    })
      .sort({ ...(orderBy && { [orderBy]: 1 }) })
      .limit(limit)
      .skip(limit * page);

    const total = await Catalog.countDocuments();
    const pages = Math.ceil(total / limit);

    return {
      catalog: catalog.map((data) => formatCatalogByProvider(data, provider)),
      total,
      pages,
    };
  }

  static async verify(
    name: string
  ): Promise<{ inLelManga: boolean; inSushiScan: boolean }> {
    const isInLelManga = await isMangaExistingInLelmanga(name);

    const isInSushiScan = await isMangaExistingInSushiscan(name);

    return { inLelManga: isInLelManga, inSushiScan: isInSushiScan };
  }

  static async add(
    name: string,
    editorialLine: MangaType,
    provider: ProviderType
  ): Promise<ICatalog> {
    const isExisting = await Catalog.findOne({ name });

    console.log("PROVIDER => ", provider);

    if (isExisting) {
      if (isExisting.providers.includes(provider)) {
        const error = new Error(
          "Ce manga existe déjà dans le catalogue."
        ) as Error & {
          code?: string;
        };

        error.code = "MANGA_ALREADY_EXISTS";
        throw error;
      } else {
        const data =
          provider === "LELMANGA"
            ? ((await getDataFromLelmanga(name, editorialLine)) as ICatalog)
            : ((await getDataFromSushiscan(name, editorialLine)) as ICatalog);

        isExisting.providers.push(provider);
        isExisting.slugs.push(data.slugs[0]);
        isExisting.covers.push(data.covers[0]);
        isExisting.synopsis.push(data.synopsis[0]);
        isExisting.tags.push(data.tags[0]);
        isExisting.chapters.push(data.chapters[0]);

        await isExisting.save();

        return isExisting;
      }
    }

    const data =
      provider === "LELMANGA"
        ? ((await getDataFromLelmanga(name, editorialLine)) as ICatalog)
        : ((await getDataFromSushiscan(name, editorialLine)) as ICatalog);

    data.providers = [provider];

    const manga: ICatalog = new Catalog(data);

    await manga.save();

    return manga;
  }

  static async updateDataAndChapters(id: string): Promise<ICatalog | null> {
    const manga = await Catalog.findById(id);

    if (!manga) {
      const error = new Error(
        "Ce manga n'existe pas dans le catalogue."
      ) as Error & {
        code?: string;
      };

      error.code = "MANGA_NOT_FOUND";
      throw error;
    }

    const [updatedFromLelmanga, updatedFromSushiscan] = await Promise.all([
      updateDataFromLelmanga(manga.name),
      updateDataFromSushiscan(manga.name),
    ]);

    const updateChapter = (providerName: string, updatedData: any) => {
      if (!updatedData?.chapters?.[0]?.lastChapter) return;

      const chapterIndex = manga.chapters.findIndex(
        (chapter) => chapter.provider === providerName
      );

      if (chapterIndex !== -1) {
        manga.chapters[chapterIndex].lastChapter =
          updatedData.chapters[0].lastChapter;
      }
    };

    updateChapter("LELMANGA", updatedFromLelmanga);
    updateChapter("SUSHISCAN", updatedFromSushiscan);

    await manga.save();

    return manga;
  }
}

export default CatalogService;
