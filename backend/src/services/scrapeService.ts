import { scrape } from "../utils/puppeteerHelper"; // Import the scrape function from puppeteerHelper
import { DEFAULT_URL } from "../config/envConfig"; // Import DEFAULT_URL from the config

interface ItemListElementContents {
  result: { link: string; title: string; price: string }[];
  length: number;
}

const scrapeHomePage = async (url: string = DEFAULT_URL, pageNumber: number): Promise<ItemListElementContents> => {
  try {
    const itemListElementContents = await scrape(url, pageNumber);
    return itemListElementContents;
  } catch (err) {
    throw new Error("Failed to scrape the page");
  }
};

export { scrapeHomePage };
