import { Request, Response } from "express";
import { scrapeHomePage } from "../services/scrapeService";  // Import from utils/scraper

export const scrapeHomePageController = async (req: Request, res: Response): Promise<void> => {
  const { url, pageNumber } = req.query;

  if (!url || !pageNumber) {
    res.status(400).json({ success: false, message: "Missing required parameters." });
    return;
  }

  try {
    const data = await scrapeHomePage(String(url), parseInt(String(pageNumber)));
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error in scrapeHomePage:", err);
    res.status(500).json({ success: false, message: "Failed to scrape data." });
  }
};
