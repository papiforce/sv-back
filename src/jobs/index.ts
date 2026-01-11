import cron from "node-cron";

// Import des jobs
import { cleanExpiredTokens } from "./cleanTokensJob";
import { updateCatalog } from "./updateCatalogJob";

/**
 * Configuration des jobs
 */
interface JobConfig {
  name: string;
  schedule: string;
  enabled: boolean;
  task: () => Promise<void>;
  description: string;
}

/**
 * Liste de tous les jobs disponibles
 */
const jobs: JobConfig[] = [
  {
    name: "cleanExpiredTokens",
    schedule: "0 * * * *", // Toutes les heures
    enabled: process.env.ENABLE_CLEAN_TOKENS_JOB !== "false",
    task: cleanExpiredTokens,
    description: "Nettoie les tokens expirés de la base de données",
  },
  {
    name: "updateCatalog",
    schedule: "0 8,16,23 * * *",
    enabled: process.env.ENABLE_UPDATE_CATALOG !== "false",
    task: updateCatalog,
    description: "Met à jour le catalogue",
  },
  // ✅ Ajoutez facilement d'autres jobs ici
];

/**
 * Démarre tous les cron jobs activés
 */
export const startJobs = (): void => {
  console.log("\n🔄 Démarrage des cron jobs...\n");

  let activeJobsCount = 0;

  jobs.forEach((job) => {
    if (!job.enabled) {
      console.log(`⏸️  [${job.name}] - Désactivé`);
      return;
    }

    try {
      cron.schedule(job.schedule, async () => {
        console.log(`\n⏰ [${job.name}] - Démarrage...`);
        const startTime = Date.now();

        try {
          await job.task();
          const duration = Date.now() - startTime;
          console.log(`✅ [${job.name}] - Terminé en ${duration}ms`);
        } catch (error) {
          console.error(`❌ [${job.name}] - Erreur:`, error);
        }
      });

      console.log(`✅ [${job.name}] - Planifié (${job.schedule})`);
      console.log(`   └─ ${job.description}\n`);
      activeJobsCount++;
    } catch (error) {
      console.error(
        `❌ [${job.name}] - Erreur lors de la planification:`,
        error
      );
    }
  });

  console.log(`\n📊 ${activeJobsCount}/${jobs.length} job(s) actif(s)\n`);
};

/**
 * Arrête tous les cron jobs
 */
export const stopJobs = (): void => {
  console.log("\n🛑 Arrêt des cron jobs...\n");
  cron.getTasks().forEach((task) => task.stop());
  console.log("✅ Tous les jobs ont été arrêtés\n");
};

/**
 * Liste tous les jobs disponibles (utile pour le monitoring)
 */
export const listJobs = (): JobConfig[] => {
  return jobs.map((job) => ({
    name: job.name,
    schedule: job.schedule,
    enabled: job.enabled,
    task: job.task,
    description: job.description,
  }));
};

/**
 * Exécute un job manuellement (utile pour les tests)
 */
export const runJobManually = async (jobName: string): Promise<void> => {
  const job = jobs.find((j) => j.name === jobName);

  if (!job) {
    throw new Error(`Job "${jobName}" non trouvé`);
  }

  console.log(`\n🔧 Exécution manuelle de [${jobName}]...`);
  const startTime = Date.now();

  try {
    await job.task();
    const duration = Date.now() - startTime;
    console.log(`✅ [${jobName}] - Terminé en ${duration}ms\n`);
  } catch (error) {
    console.error(`❌ [${jobName}] - Erreur:`, error);
    throw error;
  }
};
