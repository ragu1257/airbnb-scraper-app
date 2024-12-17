import { Router } from "express";
import { scrapeHomePageController } from "../controllers/scrapeController";

const router = Router();

router.get("/", scrapeHomePageController);

export default router;
