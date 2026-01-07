import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Interface pour les options d'envoi d'email
 */
interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: SendMailOptions["attachments"];
  replyTo?: string;
}

/**
 * Interface pour les résultats d'envoi
 */
interface EmailResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

/**
 * Service de gestion des emails avec Nodemailer
 * Support des environnements de développement (Ethereal) et production (SMTP)
 */
class EmailService {
  private transporter: Transporter | null = null;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  private readonly NODE_ENV = process.env.NODE_ENV || "development";
  private readonly APP_NAME = process.env.APP_NAME || "Scanverse";
  private readonly SMTP_HOST = process.env.SMTP_HOST;
  private readonly SMTP_PORT = process.env.SMTP_PORT || "587";
  private readonly SMTP_SECURE = process.env.SMTP_SECURE === "true";
  private readonly SMTP_USER = process.env.SMTP_USER;
  private readonly SMTP_PASSWORD = process.env.SMTP_PASSWORD;
  private readonly SMTP_FROM = process.env.SMTP_FROM;

  constructor() {
    // Initialisation automatique
    this.initialize();
  }

  /**
   * Initialise le transporteur Nodemailer
   * Gère l'initialisation une seule fois même si appelée plusieurs fois
   */
  private async initialize(): Promise<void> {
    // Si déjà initialisé ou en cours d'initialisation
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this.setupTransporter();
    await this.initializationPromise;
    this.isInitialized = true;
  }

  /**
   * Configure le transporteur selon l'environnement
   */
  private async setupTransporter(): Promise<void> {
    try {
      if (this.NODE_ENV === "development") {
        this.transporter = await this.createDevelopmentTransporter();
        console.log("📧 EmailService: Mode développement (Ethereal)");
      } else {
        this.transporter = this.createProductionTransporter();
        console.log("📧 EmailService: Mode production (SMTP)");
      }

      // Vérification de la connexion
      await this.verifyConnection();
    } catch (error) {
      console.error("❌ Erreur d'initialisation EmailService:", error);
      throw new Error("Impossible d'initialiser le service email");
    }
  }

  /**
   * Crée un transporteur pour le développement (Ethereal)
   */
  private async createDevelopmentTransporter(): Promise<Transporter> {
    const testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      logger: false,
      debug: false,
    });
  }

  /**
   * Crée un transporteur pour la production (SMTP)
   */
  private createProductionTransporter(): Transporter {
    if (!this.SMTP_HOST || !this.SMTP_USER || !this.SMTP_PASSWORD) {
      throw new Error(
        "Configuration SMTP incomplète. Vérifiez vos variables d'environnement (SMTP_HOST, SMTP_USER, SMTP_PASSWORD)"
      );
    }

    return nodemailer.createTransport({
      host: this.SMTP_HOST,
      port: parseInt(this.SMTP_PORT),
      secure: this.SMTP_SECURE,
      auth: {
        user: this.SMTP_USER,
        pass: this.SMTP_PASSWORD,
      },
      pool: true, // Utilise un pool de connexions
      maxConnections: 5, // Max 5 connexions simultanées
      maxMessages: 100, // Max 100 messages par connexion
      rateDelta: 1000, // Intervalle entre les messages (ms)
      rateLimit: 5, // Max 5 messages par rateDelta
    });
  }

  /**
   * Vérifie la connexion au serveur SMTP
   */
  private async verifyConnection(): Promise<void> {
    if (!this.transporter) {
      throw new Error("Transporteur non initialisé");
    }

    try {
      await this.transporter.verify();
      console.log("✅ Connexion SMTP vérifiée");
    } catch (error) {
      console.error("❌ Erreur de vérification SMTP:", error);
      throw error;
    }
  }

  /**
   * Envoie un email
   * @param options Options d'envoi de l'email
   * @returns Résultat de l'envoi
   */
  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    try {
      // S'assurer que le service est initialisé
      await this.initialize();

      if (!this.transporter) {
        throw new Error("Transporteur non disponible");
      }

      // Validation des paramètres
      this.validateEmailOptions(options);

      // Préparation de l'email
      const mailOptions: SendMailOptions = {
        from: options.from || this.getDefaultSender(),
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
        replyTo: options.replyTo,
      };

      // Envoi de l'email
      const info = await this.transporter.sendMail(mailOptions);

      // Résultat en développement (Ethereal)
      if (this.NODE_ENV === "development") {
        const previewUrl = nodemailer.getTestMessageUrl(
          info as SMTPTransport.SentMessageInfo
        );
        console.log("📧 Email envoyé - Preview:", previewUrl);

        return {
          success: true,
          messageId: info.messageId,
          previewUrl: previewUrl || undefined,
        };
      }

      // Résultat en production
      console.log("📧 Email envoyé avec succès:", info.messageId);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("❌ Erreur d'envoi d'email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Envoie un email à plusieurs destinataires
   */
  async sendBulkEmail(
    recipients: string[],
    subject: string,
    htmlContent: string
  ): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const recipient of recipients) {
      const result = await this.sendEmail({
        to: recipient,
        subject,
        html: htmlContent,
      });
      results.push(result);

      // Pause entre les envois pour respecter les limites
      await this.sleep(200);
    }

    return results;
  }

  /**
   * Valide les options d'envoi d'email
   */
  private validateEmailOptions(options: SendEmailOptions): void {
    if (!options.to) {
      throw new Error("Le destinataire (to) est requis");
    }

    if (!options.subject) {
      throw new Error("Le sujet (subject) est requis");
    }

    if (!options.html && !options.text) {
      throw new Error("Le contenu de l'email (html ou text) est requis");
    }
  }

  /**
   * Retourne l'expéditeur par défaut
   */
  private getDefaultSender(): string {
    return `"${this.APP_NAME}" <${this.SMTP_FROM || "noreply@example.com"}>`;
  }

  /**
   * Pause asynchrone
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Ferme le transporteur proprement
   */
  async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.isInitialized = false;
      console.log("📧 EmailService fermé");
    }
  }

  /**
   * Vérifie si le service est prêt
   */
  isReady(): boolean {
    return this.isInitialized && this.transporter !== null;
  }
}

export default new EmailService();
