import puppeteer from "puppeteer";
import { createBrowser, createPage } from "./puppeteer";

(async () => {
  const browser = await createBrowser();
  const page = await createPage(browser);
  await page.goto("https://instagram.com");

  // await browser.close();
})();
