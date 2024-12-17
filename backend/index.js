const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
require("dotenv").config(); // For environment variable management

const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for flexibility

app.use(cors());

async function scrapeHomePage(url = "https://www.airbnb.com/") {
  let browser;

  try {
    // Launch Puppeteer browser in headless mode (reuse browser instance)
    browser = await puppeteer.launch({ headless: true });

    // Create a new page in the browser
    const page = await browser.newPage();

    // Set a user agent to mimic a real user and avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    );

    // Navigate to the provided URL with a timeout of 30 seconds
    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000, // Timeout after 30 seconds
      });
    } catch (gotoError) {
      console.error("Navigation Timeout Error:", gotoError);
      throw new Error(`Failed to navigate to the page: ${gotoError.message}`);
    }

    // Wait for the itemListElement to be available with a 10-second timeout
    try {
      await page.waitForSelector("[itemprop='itemListElement']", {
        timeout: 10000, // Timeout after 10 seconds
      });
    } catch (timeoutError) {
      console.error("Timeout error:", timeoutError);
      throw new Error("Element not found in time.");
    }

    // Extract data using page.evaluate() for direct interaction with DOM
    const itemListElementContents = await page.evaluate(() => {
      const result = [];
      const itemListElements = document.querySelectorAll(
        "[itemprop='itemListElement']"
      );
      const maxItems = 10;

      // Process the first 10 itemListElements
      itemListElements.forEach((el, index) => {
        if (index >= maxItems) return;

        const link = el.querySelector("[itemprop='url']")
          ? "https://" +
              el.querySelector("[itemprop='url']").getAttribute("content") ||
            "https://" + el.querySelector("[itemprop='url']").textContent.trim()
          : "N/A";

        const title = el.querySelector("[itemprop='name']")
          ? el.querySelector("[itemprop='name']").getAttribute("content") ||
            el.querySelector("[itemprop='name']").textContent.trim()
          : "N/A";

        const regex = /([^\w\s]\s?\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*per\s+night/i;
        const priceMatch = el.textContent.match(regex);
        const price = priceMatch ? priceMatch[1] : "N/A"; // Safeguard for missing price

        result.push({ link, title, price });
      });

      return result;
    });

    console.log(itemListElementContents);
    return itemListElementContents;
  } catch (err) {
    console.error("Error scraping page:", err);
    throw new Error("Failed to scrape the page");
  } finally {
    // Ensure the browser is closed even if an error occurs
    if (browser) {
      await browser.close();
    }
  }
}

// Route to trigger the scraping for a given URL
app.get("/scrape", async (req, res) => {
  const { url } = req.query;
  const targetUrl = url || "https://www.airbnb.com/"; // Default to Airbnb if no URL is provided

  try {
    const data = await scrapeHomePage(targetUrl);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
