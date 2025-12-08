import { Express, Request, Response, NextFunction } from "express";

const formatLocalDate = (date: Date): string => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year}T${hours}:${minutes}:${seconds}`;
};

const logger = (app: Express) => {
  return app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      const now = formatLocalDate(new Date());
      const { method, originalUrl } = req;
      const { statusCode } = res;

      const reset = "\x1b[0m";
      const green = "\x1b[32m";
      const red = "\x1b[31m";
      const blue = "\x1b[34m";

      let color = blue;
      if (statusCode >= 200 && statusCode < 300) color = green;
      else if (statusCode >= 400) color = red;

      console.log(
        `${color}[${now}] ${method} ${originalUrl} ${statusCode} - ${duration}ms${reset}`
      );
    });

    next();
  });
};

export default logger;
