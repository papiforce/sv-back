import { ICatalog } from "../models";
import { ProviderType, FormattedCatalogType } from "../types";

const formatCatalogByProvider = (
  data: ICatalog,
  provider: ProviderType
): FormattedCatalogType | null => {
  if (!data.providers.includes(provider)) {
    return null;
  }

  const getProviderData = <T>(
    array: Array<any>,
    key: keyof T
  ): T[keyof T] | null => {
    const item = array.find((item) => item.provider === provider);
    return item ? (item[key as string] as T[keyof T]) : null;
  };

  return {
    _id: data._id,
    name: data.name,
    editorialLine: data.editorialLine,
    status: data.status,
    type: data.type,
    year: data.year,
    author: data.author,
    artist: data.artist,

    provider: provider,
    slug: getProviderData(data.slugs, "slug") || "",
    cover: getProviderData(data.covers, "cover") || "",
    synopsis: getProviderData(data.synopsis, "synopsis") || "",
    tags: getProviderData(data.tags, "tags") || [],
    chapters: getProviderData(data.chapters, "firstChapter")
      ? {
          firstChapter: data.chapters.find((c) => c.provider === provider)!
            .firstChapter,
          lastChapter: data.chapters.find((c) => c.provider === provider)!
            .lastChapter,
        }
      : {
          firstChapter: { number: 1, url: "" },
          lastChapter: { number: 0, url: "" },
        },
  };
};

export default formatCatalogByProvider;
