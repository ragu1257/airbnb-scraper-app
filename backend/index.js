const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

async function scrapeHomePage(url = "https://www.airbnb.com/") {
  let browser;

  try {
    // Launch puppeteer browser in headless mode (reuse browser instance)
    browser = await puppeteer.launch({ headless: true });

    // Create a new page in the browser
    const page = await browser.newPage();

    // Set a user agent to mimic a real user and avoid detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    );

    // Navigate to the provided URL and wait until the network is idle
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait for the itemListElement to be available
    await page.waitForSelector("[itemprop='itemListElement']", {
      timeout: 10000,
    });

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

        const price = el.textContent.match(regex)[1];

        // const price = el.querySelector(
        //   "div > div > div > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div > div > span > div > span"
        // )
        //   ? el
        //       .querySelector(
        //         "div > div > div > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > div > div > span > div > span"
        //       )
        //       .textContent.trim()
        //   : "N/A";

        result.push({ link, title, price });
      });

      return result;
    });
    console.log(itemListElementContents);

    return itemListElementContents;
  } catch (err) {
    console.error("Error:", err.message);
    return [];
  } finally {
    // Ensure the browser is closed even if an error occurs
    if (browser) {
      await browser.close();
    }
  }
}

// // Trigger the scraping for the fixed Airbnb URL
// scrapeHomePage("https://www.airbnb.com/").then(data => {
//   console.log(data);
// });

// Route to trigger the scraping for a given URL
app.get("/scrape", async (req, res) => {
  const data = await scrapeHomePage();
  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
