import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const {
  NODE_ENV,
  APP_NAME,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
} = process.env;

class EmailService {
  private transporter: Transporter;

  private setupTransporter = async () => {
    if (NODE_ENV === "development") {
      const testAccount = await nodemailer.createTestAccount();

      return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      return nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || "587"),
        secure: SMTP_SECURE === "true",
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      });
    }
  };

  constructor() {
    this.setupTransporter().then((transporter) => {
      this.transporter = transporter;
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    from?: string,
    attachments?: nodemailer.SendMailOptions["attachments"]
  ) {
    try {
      const defaultSender = `"${APP_NAME}" <${SMTP_FROM}>`;

      const infos = await this.transporter.sendMail({
        from: from || defaultSender,
        to,
        subject,
        html: htmlContent,
        attachments,
      });

      if (NODE_ENV === "development") {
        console.log(
          "Preview URL: %s",
          nodemailer.getTestMessageUrl(infos as SMTPTransport.SentMessageInfo)
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

export default new EmailService();
