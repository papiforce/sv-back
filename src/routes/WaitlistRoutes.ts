import { Router } from "express";

import { WaitlistController } from "../controllers";

const router = Router();

router.post("/join", WaitlistController.add);

export default router;
