import * as cheerio from "cheerio";
import axios from "axios";

import { slugify } from "@/utils/slugify";

import {
  ICatalog,
  EditorialLine,
  PublicationStatus,
  WorkType,
} from "@/models/CatalogModel";
import { IChapter } from "@/models/ChapterModel";

export const isMangaExistingInSushiscan = async (
  title: string,
  slug?: string
) => {
  const generatedSlug = slugify(slug ? slug : title);
  const url = `https://sushiscan.fr/catalogue/${generatedSlug}/`;

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      return false;
    }

    const $ = cheerio.load(response.data);
    const mangaTitle = $("h1").text().trim();

    if (!mangaTitle.includes(title)) return false;

    if (mangaTitle) return true;

    return false;
  } catch {
    return false;
  }
};

export const getDataFromSushiscan = async (
  title: string,
  editorialLine: EditorialLine,
  slug?: string
) => {
  const generatedSlug = slugify(slug ? slug : title);

  const url = `https://sushiscan.fr/catalogue/${generatedSlug}/`;

  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const data: Partial<ICatalog> & { chapters?: Partial<IChapter>[] } = {
    title,
    slug: generatedSlug,
    editorialLine,
  };

  // GET COVER
  data["coverImage"] = $("div.thumb-container > div.thumb > img").attr("src");

  // GET SYNOPSIS
  data["synopsis"] = $(
    "div.seriestucontentr > div.seriestuhead > div.entry-content.entry-content-single"
  )
    .text()
    .trim();

  // GET TAGS
  const tags: string[] = [];

  $("div.seriestucontent > div.seriestucontentr > div.seriestugenre")
    .find("a")
    .each((index, element) => {
      const bannishedTags = ["Seinen", "Shoujo", "Shounen"];

      const tagText = $(element).text().trim();
      if (tagText && !bannishedTags.includes(tagText)) {
        tags.push(tagText);
      }
    });

  data["tags"] = tags;

  // GET CHAPTERS
  const lastChapter = $(
    "div.seriestucontent > div.seriestucontentr > div.seriestuhead > div.lastend > div:nth-child(2) > a"
  )
    .text()
    .trim();

  const lastChapterToArray = lastChapter.split(" ");
  const lastChapterNumber = lastChapterToArray[lastChapterToArray.length - 1];

  data["totalChapters"] = Number(lastChapterNumber);
  data["latestChapterNumber"] = Number(lastChapterNumber);
  data["latestChapterDate"] = $(
    "#chapterlist > ul > li:nth-child(1) > div > div > a > span.chapterdate"
  )
    .text()
    .trim() as unknown as Date;

  const chapters: Partial<IChapter>[] = [];

  $("ul li[data-num]").each((index, element) => {
    const $li = $(element);

    // 📊 Récupérer le numéro du chapitre depuis data-num
    const chapterNumber = parseInt($li.attr("data-num") || "0", 10);
    const chapterText = $li.find(".chapternum").text().trim();

    // 📅 Récupérer la date depuis .chapterdate
    const releaseDate = $li.find(".chapterdate").text().trim();

    // ✅ Ajouter uniquement si le numéro est valide
    if (chapterNumber > 0 && releaseDate) {
      chapters.push({
        chapterNumber,
        releaseDate: new Date(releaseDate),
        isVolume: chapterText.includes("Volume"),
      } as Partial<IChapter>);
    }
  });

  data["chapters"] = chapters;

  // GET OTHERS INFOS
  const infos = $(
    "div.seriestucontent > div.seriestucontentr > div.seriestucont > div > table"
  );

  infos.find("tr").each((index, element) => {
    const content = $(element)
      .contents()
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .filter((text) => text.length > 0);

    if (content[0] === "Statut") {
      switch (content[1]) {
        case "Terminé":
          data["status"] = PublicationStatus.COMPLETED;
          break;
        case "En Pause":
          data["status"] = PublicationStatus.HIATUS;
          break;
        case "Abandonné":
          data["status"] = PublicationStatus.CANCELLED;
          break;
        default:
          data["status"] = PublicationStatus.ONGOING;
      }
    }

    if (content[0] === "Type") {
      if (content[1]) {
        data["type"] = content[1].toUpperCase() as WorkType;
      }
    }

    if (content[0] === "Sortie") {
      data["releaseYear"] = content[1] as unknown as number;
    }

    if (content[0] === "Auteur") {
      data["author"] = content[1];
    }

    if (content[0] === "Dessinateur") {
      data["artist"] = content[1];
    }
  });

  return data;
};

export const updateDataFromSushiscan = async (
  slug: string,
  oldLastChapter: number
) => {
  const generatedSlug = slugify(slug);

  const url = `https://sushiscan.fr/catalogue/${generatedSlug}/`;

  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const data: Partial<ICatalog> & { chapters?: Partial<IChapter>[] } = {};

  // GET COVER
  data["coverImage"] = $("div.thumb-container > div.thumb > img").attr("src");

  // GET CHAPTERS
  const lastChapter = $(
    "div.seriestucontent > div.seriestucontentr > div.seriestuhead > div.lastend > div:nth-child(2) > a"
  )
    .text()
    .trim();

  const lastChapterToArray = lastChapter.split(" ");
  const lastChapterNumber = Number(
    lastChapterToArray[lastChapterToArray.length - 1]
  );

  if (lastChapterNumber > oldLastChapter) {
    data["totalChapters"] = Number(lastChapterNumber);
    data["latestChapterNumber"] = Number(lastChapterNumber);
    data["latestChapterDate"] = $(
      "#chapterlist > ul > li:nth-child(1) > div > div > a > span.chapterdate"
    )
      .text()
      .trim() as unknown as Date;

    const chapters: Partial<IChapter>[] = [];
    let foundOldChapter = false;

    // 🔄 Parcourir du plus récent au plus ancien
    $("ul li[data-num]").each((index, element) => {
      // 🛑 Arrêter si on a déjà trouvé l'ancien dernier chapitre
      if (foundOldChapter) return false;

      const $li = $(element);
      const chapterNumber = parseInt($li.attr("data-num") || "0", 10);

      // 🎯 Vérifier si on a atteint l'ancien dernier chapitre
      if (chapterNumber <= oldLastChapter) {
        foundOldChapter = true;
        return false; // Arrêter la boucle
      }

      const chapterText = $li.find(".chapternum").text().trim();
      const releaseDate = $li.find(".chapterdate").text().trim();

      if (chapterNumber > 0 && releaseDate) {
        chapters.push({
          chapterNumber,
          releaseDate: new Date(releaseDate),
          isVolume: chapterText.includes("Volume"),
        } as Partial<IChapter>);
      }
    });

    data["chapters"] = chapters;

    console.log(
      `📚 ${chapters.length} nouveaux chapitres ajoutés (${
        oldLastChapter + 1
      } → ${lastChapterNumber})`
    );
  }

  // GET OTHERS INFOS
  const infos = $(
    "div.seriestucontent > div.seriestucontentr > div.seriestucont > div > table"
  );

  infos.find("tr").each((index, element) => {
    const content = $(element)
      .contents()
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .filter((text) => text.length > 0);

    if (content[0] === "Statut") {
      switch (content[1]) {
        case "Terminé":
          data["status"] = PublicationStatus.COMPLETED;
          break;
        case "En Pause":
          data["status"] = PublicationStatus.HIATUS;
          break;
        case "Abandonné":
          data["status"] = PublicationStatus.CANCELLED;
          break;
        default:
          data["status"] = PublicationStatus.ONGOING;
      }
    }

    if (content[0] === "Type") {
      if (content[1]) {
        data["type"] = content[1].toUpperCase() as WorkType;
      }
    }

    if (content[0] === "Sortie") {
      data["releaseYear"] = content[1] as unknown as number;
    }

    if (content[0] === "Auteur") {
      data["author"] = content[1];
    }

    if (content[0] === "Dessinateur") {
      data["artist"] = content[1];
    }
  });

  return data;
};
