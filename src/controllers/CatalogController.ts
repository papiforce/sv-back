import { Request, Response } from "express";

import { MangaType, ProviderType } from "../types";

import { CatalogService } from "../services";

const isMangaType = (value: any): value is MangaType => {
  return value === "SHONEN" || value === "SEINEN" || value === "SHOJO";
};

const isProvider = (value: any): value is ProviderType => {
  return value === "LELMANGA" || value === "SUSHISCAN";
};

class CatalogController {
  async get(req: Request, res: Response): Promise<void> {
    try {
      const {
        id,
        search,
        orderBy,
        provider = "SUSHISCAN",
        limit = "20",
        page = "0",
      } = req.query as unknown as Record<string, string>;

      const limitNum = Number(limit);
      const pageNum = Number(page);

      const providerParam: ProviderType | undefined = isProvider(provider)
        ? provider
        : undefined;

      const catalog = await CatalogService.get(
        id,
        search,
        orderBy,
        providerParam,
        limitNum,
        pageNum
      );

      res.status(200).json({ success: true, data: catalog });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'ajout du manga.",
        errors: { global: (error as Error).message },
      });
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name || name === "") {
        res.status(400).json({
          success: false,
          errors: { name: "Le nom est requis" },
        });

        return;
      }

      const isExisting = await CatalogService.verify(name);

      const formatResponse = (response: {
        inLelManga: boolean;
        inSushiScan: boolean;
      }) => {
        if (response.inLelManga && response.inSushiScan) {
          return `${name} est disponible sur Lelmanga et Sushiscan.`;
        }

        if (response.inLelManga && !response.inSushiScan) {
          return `${name} est disponible sur Lelmanga.`;
        }

        if (!response.inLelManga && response.inSushiScan) {
          return `${name} est disponible sur Sushiscan.`;
        }

        return `${name} n'est pas disponible.`;
      };

      res.status(isExisting ? 200 : 400).json({
        success: true,
        message: formatResponse(isExisting),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la vérification du manga.",
        errors: { global: (error as Error).message },
      });
    }
  }

  async add(req: Request, res: Response): Promise<void> {
    try {
      const { name, editorialLine, provider } = req.body;

      let errors: Record<string, string> = {};

      if (!name || name === "") {
        errors["name"] = "Le nom est requis.";
      }

      if (!editorialLine || editorialLine === "") {
        errors["editorialLine"] = "La ligne éditoriale est requise.";
      }

      if (
        editorialLine &&
        editorialLine !== "" &&
        !isMangaType(editorialLine)
      ) {
        errors["editorialLine"] =
          "La ligne éditoriale doit être une des suivantes : SHONEN, SEINEN, SHOJO.";
      }

      if (provider && provider !== "" && !isProvider(provider)) {
        errors["provider"] =
          "Le provider doit être un des suivants : LELMANGA, SUSHISCAN.";
      }

      if (Object.keys(errors).length > 0) {
        res.status(400).json({ success: false, errors });

        return;
      }

      const manga = await CatalogService.add(name, editorialLine, provider);

      res.status(201).json({
        success: true,
        message: `${name} a correctement été ajouté au catalogue.`,
        manga,
      });
    } catch (error) {
      if (error?.code === "MANGA_ALREADY_EXISTS") {
        res.status(400).json({
          success: false,
          errors: { global: error.message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de l'ajout du manga.",
        errors: { global: (error as Error).message },
      });
    }
  }

  async updateDataAndChapters(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || id === "") {
        res.status(400).json({
          success: false,
          errors: { id: "L'identifiant est requis." },
        });

        return;
      }

      await CatalogService.updateDataAndChapters(id);

      res.status(204).json({
        success: true,
        message: `Œuvre mise à jour avec succès.`,
      });
    } catch (error) {
      if (error?.code === "MANGA_ALREADY_EXISTS") {
        res.status(400).json({
          success: false,
          errors: { global: error.message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors de la mise à jour du manga.",
        errors: { global: (error as Error).message },
      });
    }
  }
}

export default new CatalogController();
