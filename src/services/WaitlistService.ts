import { Waitlist } from "../models";

import { generateCode } from "../utils";

import EmailService from "./EmailService";
import { waitlistEmail } from "../emails";

class WaitlistService {
  static async add(email: string): Promise<boolean> {
    const existingEmail = await Waitlist.findOne({ email });

    if (existingEmail) {
      const error = new Error("Cet email est déjà utilisé.") as Error & {
        code?: string;
      };

      error.code = "EMAIL_ALREADY_USED";
      throw error;
    }

    const BATCH_SIZE = 5;
    const codes: string[] = [];

    for (let i = 0; i < BATCH_SIZE; i++) {
      codes.push(generateCode());
    }

    const existingCodes = await Waitlist.find({
      code: { $in: codes },
    }).select("code");

    const usedCodes = new Set(existingCodes.map((doc) => doc.code));

    let uniqueCode: string | null = null;

    for (const code of codes) {
      if (!usedCodes.has(code)) {
        uniqueCode = code;
        break;
      }
    }

    if (!uniqueCode) {
      let attempts = 0;
      const MAX_ATTEMPTS = 10;

      while (attempts < MAX_ATTEMPTS) {
        const generatedCode = generateCode();
        const existingCode = await Waitlist.findOne({ code: generatedCode });

        if (!existingCode) {
          uniqueCode = generatedCode;
          break;
        }

        attempts++;
      }
    }

    if (!uniqueCode) {
      const error = new Error(
        "Impossible de générer un code unique. Réessayez."
      ) as Error & {
        code?: string;
      };

      error.code = "CODE_NOT_GENERATED";
      throw error;
    }

    await Waitlist.create({
      email,
      code: uniqueCode,
    });

    EmailService.sendEmail(
      email,
      "Bienvenue sur Scanverse - Votre code de parrainage",
      waitlistEmail(email, uniqueCode, process.env.FRONTEND_URL)
    );

    return true;
  }
}

export default WaitlistService;
