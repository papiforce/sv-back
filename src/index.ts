import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectToDatabase, passport } from "./config";

import routes from "./routes";

dotenv.config();

const app = express();

const allowedOrigins = process.env.AUTHORIZED_ORIGINS
  ? process.env.AUTHORIZED_ORIGINS.split(",")
  : ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    var options;
    if (allowedOrigins.indexOf(origin) !== -1) {
      options = { origin: true };
    } else {
      options = { origin: false };
    }
    callback(null, options);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

routes(app);

app.get("/", (req: Request, res: Response) => {
  res.send("API SCANVERSE");
});

app.get("/api", (req: Request, res: Response) => {
  res.send("API SCANVERSE");
});

const port = process.env.PORT || 4000;

if (!process.env.PORT) {
  console.warn(
    "PORT environment variable is not set. Using default value 4000."
  );
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set. Exiting...");
  process.exit(1);
}

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(port, () => {
      console.log(`Le serveur tourne sur le port ${port}`);
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur : ", error);
  }
}

startServer();

export default app;
