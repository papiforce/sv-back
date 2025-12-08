import * as cheerio from "cheerio";
import axios from "axios";

import { slugify } from "../utils";

import { MangaType } from "../types";
import { ICatalog } from "../models";

export const isMangaExistingInSushiscan = async (name: string) => {
  const slug = slugify(name);
  const url = `https://sushiscan.fr/catalogue/${slug}/`;

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      return false;
    }

    const $ = cheerio.load(response.data);
    const mangaTitle = $("h1").text().trim();

    if (mangaTitle !== name) return false;

    if (mangaTitle) return true;

    return false;
  } catch {
    return false;
  }
};

export const getDataFromSushiscan = async (
  name: string,
  editorialLine: MangaType
) => {
  const slug = slugify(name);
  const url = `https://sushiscan.fr/catalogue/${slug}/`;

  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const data: Partial<ICatalog> = {
    name,
    slugs: [{ provider: "SUSHISCAN", slug: url }],
    editorialLine,
  };

  // GET COVER
  data["covers"] = [
    {
      provider: "SUSHISCAN",
      cover: $("div.thumb-container > div.thumb > img").attr("src"),
    },
  ];

  // GET SYNOPSIS
  data["synopsis"] = [
    {
      provider: "SUSHISCAN",
      synopsis: $(
        "div.seriestucontentr > div.seriestuhead > div.entry-content.entry-content-single"
      )
        .text()
        .trim(),
    },
  ];

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

  data["tags"] = [
    {
      provider: "SUSHISCAN",
      tags,
    },
  ];

  // GET CHAPTERS
  const firstChapter = $(
    "div.seriestucontent > div.seriestucontentr > div.seriestuhead > div.lastend > div:nth-child(1) > a"
  )
    .text()
    .trim();

  const firstChapterToArray = firstChapter.split(" ");
  const firstChapterNumber =
    firstChapterToArray[firstChapterToArray.length - 1];

  const lastChapter = $(
    "div.seriestucontent > div.seriestucontentr > div.seriestuhead > div.lastend > div:nth-child(2) > a"
  )
    .text()
    .trim();

  const lastChapterToArray = lastChapter.split(" ");
  const lastChapterNumber = lastChapterToArray[lastChapterToArray.length - 1];

  const isChapter = firstChapterToArray.includes("Chapitre");

  data["chapters"] = [
    {
      provider: "SUSHISCAN",
      firstChapter: {
        number: Number(firstChapterNumber) ? Number(firstChapterNumber) : 1,
        url: `https://www.sushiscan.fr/${slug}-${
          isChapter ? "chapitre" : "tome"
        }-${Number(firstChapterNumber) ? Number(firstChapterNumber) : 1}`,
      },
      lastChapter: {
        number: Number(lastChapterNumber),
        url: `https://www.sushiscan.fr/${slug}-${
          isChapter ? "chapitre" : "tome"
        }-${Number(lastChapterNumber)}`,
      },
    },
  ];

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
      data["status"] = content[1] === "En Cours" ? "ONGOING" : "COMPLETED";
    }

    if (content[0] === "Type") {
      data["type"] = content[1].toUpperCase();
    }

    if (content[0] === "Sortie") {
      data["year"] = content[1];
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

export const updateDataFromSushiscan = async (name: string) => {
  const slug = slugify(name);
  const url = `https://sushiscan.fr/catalogue/${slug}/`;

  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const data: Partial<ICatalog> = {};

  // GET COVER
  data["covers"] = [
    {
      provider: "SUSHISCAN",
      cover: $("div.thumb-container > div.thumb > img").attr("src"),
    },
  ];

  // GET CHAPTERS
  const firstChapter = $(
    "div.seriestucontent > div.seriestucontentr > div.seriestuhead > div.lastend > div:nth-child(1) > a"
  )
    .text()
    .trim();

  const firstChapterToArray = firstChapter.split(" ");
  const firstChapterNumber =
    firstChapterToArray[firstChapterToArray.length - 1];

  const lastChapter = $(
    "div.seriestucontent > div.seriestucontentr > div.seriestuhead > div.lastend > div:nth-child(2) > a"
  )
    .text()
    .trim();

  const lastChapterToArray = lastChapter.split(" ");
  const lastChapterNumber = lastChapterToArray[lastChapterToArray.length - 1];

  const isChapter = firstChapterToArray.includes("Chapitre");

  data["chapters"] = [
    {
      provider: "SUSHISCAN",
      firstChapter: {
        number: Number(firstChapterNumber) ? Number(firstChapterNumber) : 1,
        url: `https://www.sushiscan.fr/${slug}-${
          isChapter ? "chapitre" : "tome"
        }-${Number(firstChapterNumber) ? Number(firstChapterNumber) : 1}`,
      },
      lastChapter: {
        number: Number(lastChapterNumber),
        url: `https://www.sushiscan.fr/${slug}-${
          isChapter ? "chapitre" : "tome"
        }-${Number(lastChapterNumber)}`,
      },
    },
  ];

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
      data["status"] = content[1] === "En Cours" ? "ONGOING" : "COMPLETED";
    }

    if (content[0] === "Type") {
      data["type"] = content[1].toUpperCase();
    }

    if (content[0] === "Sortie") {
      data["year"] = content[1];
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
