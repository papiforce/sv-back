# 📋 Cron Jobs

## Liste des jobs disponibles

### 1. cleanExpiredTokens

- **Schedule**: Tous les jours à 3h du matin (`0 3 * * *`)
- **Description**: Supprime les refresh tokens expirés de la base de données
- **Désactivation**: `ENABLE_CLEAN_TOKENS_JOB=false`

## Ajouter un nouveau job

1. Créer un fichier dans `/src/jobs/` (ex: `myNewJob.ts`)
2. Exporter une fonction asynchrone
3. L'ajouter dans le tableau `jobs` de `/src/jobs/index.ts`

Exemple :

```typescript
// /src/jobs/myNewJob.ts
export const myNewJobTask = async (): Promise<void> => {
  console.log("Mon job s'exécute !");
};

// /src/jobs/index.ts
import { myNewJobTask } from "./myNewJob";

const jobs: JobConfig[] = [
  // ... autres jobs
  {
    name: "myNewJob",
    schedule: "0 0 * * *", // Tous les jours à minuit
    enabled: process.env.ENABLE_MY_NEW_JOB !== "false",
    task: myNewJobTask,
    description: "Description de mon job",
  },
];
```

---

## 🧪 **Route de debug (optionnel)**

### **Ajouter dans `/src/routes/index.ts`**

```typescript
import { listJobs, runJobManually } from "@/jobs";

// ====================================
// ROUTES DE DEBUG (DEVELOPMENT ONLY)
// ====================================

if (environment === "development") {
  /**
   * @route GET /api/v1/jobs
   * @desc Liste tous les jobs configurés
   * @access Private (dev only)
   */
  app.get(`${API_ROUTE}/jobs`, (req: Request, res: Response) => {
    const jobs = listJobs();
    res.json({
      success: true,
      count: jobs.length,
      jobs: jobs.map((job) => ({
        name: job.name,
        schedule: job.schedule,
        enabled: job.enabled,
        description: job.description,
      })),
    });
  });

  /**
   * @route POST /api/v1/jobs/:jobName/run
   * @desc Exécute un job manuellement
   * @access Private (dev only)
   */
  app.post(
    `${API_ROUTE}/jobs/:jobName/run`,
    async (req: Request, res: Response) => {
      try {
        const { jobName } = req.params;
        await runJobManually(jobName);
        res.json({
          success: true,
          message: `Job "${jobName}" exécuté avec succès`,
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    }
  );
}
```
