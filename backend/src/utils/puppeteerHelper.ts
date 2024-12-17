import puppeteer, { Browser } from "puppeteer";

interface Listing {
  link: string;
  title: string;
  price: string;
}

export const scrape = async (url: string, pageNumber: number): Promise<{ result: Listing[]; length: number }> => {
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    await page.waitForSelector("[itemprop='itemListElement']", { timeout: 10000 });

    const itemListElementContents = await page.evaluate(
      (pageNumber) => {
        const result: Listing[] = [];
        const itemListElements = document.querySelectorAll("[itemprop='itemListElement']");

        const startItem = (pageNumber - 1) * 10;
        const endItem = pageNumber * 10;

        itemListElements.forEach((el, index) => {
          if (index >= startItem && index < endItem) {
            const link = el.querySelector("[itemprop='url']")
              ? "https://" + el.querySelector("[itemprop='url']")!.getAttribute("content") ||
              "https://" + el.querySelector("[itemprop='url']")!.textContent!.trim()
              : "N/A";

            const title = el.querySelector("[itemprop='name']")
              ? el.querySelector("[itemprop='name']")!.getAttribute("content") ||
              el.querySelector("[itemprop='name']")!.textContent!.trim()
              : "N/A";

            const regex = /([^\w\s]\s?\d+(?:,\d{3})*(?:\.\d{1,2})?)\s*per\s+night/i;
            const priceMatch = el.textContent!.match(regex);
            const price = priceMatch ? priceMatch[1] : "N/A";

            result.push({ link, title, price });
          }
        });

        return { result, length: itemListElements.length };
      },
      pageNumber
    );

    return itemListElementContents;
  } catch (err) {
    console.error("Error scraping page:", err);
    throw new Error("Failed to scrape the page");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
