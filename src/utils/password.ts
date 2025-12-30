import bcrypt from "bcryptjs";

export class PasswordUtils {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hash un mot de passe
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare un mot de passe avec son hash
   */
  static async compare(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Valide la force du mot de passe
   */
  static validate(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une minuscule");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push(
        "Le mot de passe doit contenir au moins un caractère spécial"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
