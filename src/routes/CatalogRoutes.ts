import { Router } from "express";

import { CatalogController } from "../controllers";

const router = Router();

router.get("/", CatalogController.get);

router.post("/verify", CatalogController.verify);
router.post("/", CatalogController.add);

router.put("/data-and-chapters/:id", CatalogController.updateDataAndChapters);

export default router;
