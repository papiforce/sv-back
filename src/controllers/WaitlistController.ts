import { Request, Response } from "express";

import { WaitlistService } from "../services";

class WaitlistController {
  async add(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Email requis" });

        return;
      }

      await WaitlistService.add(email);

      res.status(200).json({ success: true });
    } catch (error) {
      const errorsCode = ["CODE_NOT_GENERATED", "EMAIL_ALREADY_USED"];

      if (
        errorsCode.includes((error as Error & { code?: string }).code || "")
      ) {
        res.status(409).json({
          success: false,
          errors: { global: (error as Error).message },
        });

        return;
      }

      res.status(500).json({
        success: false,
        message: "Une erreur est survenue lors à la liste d'attente",
        errors: { global: (error as Error).message },
      });
    }
  }
}

export default new WaitlistController();
