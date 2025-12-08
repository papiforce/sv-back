import * as cheerio from "cheerio";
import axios from "axios";

import { slugify } from "../utils";

import { MangaType } from "../types";
import { ICatalog } from "../models";

export const isMangaExisting = async (name: string) => {
  const slug = slugify(name);
  const url = `https://www.lelmanga.com/manga/${slug}/`;

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

export const getDataFromLelmanga = async (
  name: string,
  editorialLine: MangaType
) => {
  const slug = slugify(name);
  const url = `https://www.lelmanga.com/manga/${slug}/`;

  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const data: Partial<ICatalog> = {
    name,
    slugs: [{ provider: "LELMANGA", slug: url }],
    editorialLine,
  };

  // GET COVER
  data["covers"] = [
    {
      provider: "LELMANGA",
      cover: $("div.main-info > div.info-left > div > div.thumb > img").attr(
        "src"
      ),
    },
  ];

  // GET SYNOPSIS
  data["synopsis"] = [
    {
      provider: "LELMANGA",
      synopsis: $(
        "div.main-info > div.info-right > div.info-desc.bixbox > div:nth-child(3) > div > p"
      )
        .text()
        .trim(),
    },
  ];

  // GET TAGS
  const tags: string[] = [];

  $(
    "div.main-info > div.info-right > div.info-desc.bixbox > div:nth-child(2) > span"
  )
    .find("a")
    .each((index, element) => {
      const tagText = $(element).text().trim();
      if (tagText) {
        tags.push(tagText);
      }
    });

  data["tags"] = [
    {
      provider: "LELMANGA",
      tags,
    },
  ];

  // GET CHAPTERS
  const firstChapter = $(
    "div.main-info > div.info-right > div.bixbox.bxcl.epcheck > div.lastend > div:nth-child(1) > a > span.epcur.epcurfirst"
  )
    .text()
    .trim();

  const firstChapterToArray = firstChapter.split(" ");
  const firstChapterNumber =
    firstChapterToArray[firstChapterToArray.length - 1];

  const lastChapter = $(
    "div.main-info > div.info-right > div.bixbox.bxcl.epcheck > div.lastend > div:nth-child(2) > a > span.epcur.epcurlast"
  )
    .text()
    .trim();

  const lastChapterToArray = lastChapter.split(" ");
  const lastChapterNumber = lastChapterToArray[lastChapterToArray.length - 1];

  data["chapters"] = [
    {
      provider: "LELMANGA",
      firstChapter: {
        number: Number(firstChapterNumber) ? Number(firstChapterNumber) : 1,
        url: `https://www.lelmanga.com/${slug}-${
          Number(firstChapterNumber) ? Number(firstChapterNumber) : 1
        }`,
      },
      lastChapter: {
        number: Number(lastChapterNumber),
        url: `https://www.lelmanga.com/${slug}-${lastChapterNumber}`,
      },
    },
  ];

  // GET OTHERS INFOS
  const infos = $("div.main-info > div.info-left > div > div.tsinfo.bixbox");

  infos.find("div").each((index, element) => {
    const text = $(element).text().trim();
    const value = $(element).find("i").text().trim();

    if (text.includes("Status")) {
      data["status"] = value.toUpperCase();
    }

    if (text.includes("Type")) {
      const typeToArray = text.split(" ");
      data["type"] = typeToArray[typeToArray.length - 1].toUpperCase();
    }

    if (text.includes("Publié")) {
      data["year"] = value;
    }

    if (text.includes("Auteur")) {
      data["author"] = value;
    }

    if (text.includes("Artiste")) {
      data["artist"] = value;
    }
  });

  return data;
};

export const updateDataFromLelmanga = async (name: string) => {
  const slug = slugify(name);
  const url = `https://www.lelmanga.com/manga/${slug}/`;

  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const data: Partial<ICatalog> = {};

  // GET COVER
  data["covers"] = [
    {
      provider: "LELMANGA",
      cover: $("div.main-info > div.info-left > div > div.thumb > img").attr(
        "src"
      ),
    },
  ];

  // GET CHAPTERS
  const firstChapter = $(
    "div.main-info > div.info-right > div.bixbox.bxcl.epcheck > div.lastend > div:nth-child(1) > a > span.epcur.epcurfirst"
  )
    .text()
    .trim();

  const firstChapterToArray = firstChapter.split(" ");
  const firstChapterNumber =
    firstChapterToArray[firstChapterToArray.length - 1];

  const lastChapter = $(
    "div.main-info > div.info-right > div.bixbox.bxcl.epcheck > div.lastend > div:nth-child(2) > a > span.epcur.epcurlast"
  )
    .text()
    .trim();

  const lastChapterToArray = lastChapter.split(" ");
  const lastChapterNumber = lastChapterToArray[lastChapterToArray.length - 1];

  data["chapters"] = [
    {
      provider: "LELMANGA",
      firstChapter: {
        number: Number(firstChapterNumber),
        url: `https://www.lelmanga.com/${slug}-${firstChapterNumber}`,
      },
      lastChapter: {
        number: Number(lastChapterNumber),
        url: `https://www.lelmanga.com/${slug}-${lastChapterNumber}`,
      },
    },
  ];

  // GET OTHERS INFOS
  const infos = $("div.main-info > div.info-left > div > div.tsinfo.bixbox");

  infos.find("div").each((index, element) => {
    const text = $(element).text().trim();
    const value = $(element).find("i").text().trim();

    if (text.includes("Status") && value !== "ONGOING") {
      data["status"] = value.toUpperCase();
    }

    if (text.includes("Type")) {
      const typeToArray = text.split(" ");
      data["type"] = typeToArray[typeToArray.length - 1].toUpperCase();
    }

    if (text.includes("Publié")) {
      data["year"] = value;
    }

    if (text.includes("Auteur")) {
      data["author"] = value;
    }

    if (text.includes("Artiste")) {
      data["artist"] = value;
    }
  });

  return data;
};
