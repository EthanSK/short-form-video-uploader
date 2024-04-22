import puppeteer, { Browser, Locator, NodeFor, Page } from "puppeteer";
import fs from "fs-extra";

export async function createBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo: undefined, // might be useful for debugging
    defaultViewport: null, //so the viewport changes with window size
    timeout: 60_000,
    userDataDir: "./user_data", // to persist login stuff
    args: [
      "--no-sandbox",
      "--disable-notifications",
      `--window-size=${1920},${900}`,
    ], //chromium notifs get in the way when in non headless mode
  });

  return browser;
}

export async function createPage(browser: Browser) {
  const page = await browser.newPage();

  await page.setCacheEnabled(true);
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
  ); //so we don't look like a bot
  // await page.setDefaultTimeout(0); //commmend and uncomment as needed

  return page;
}

export function getLocatorWithText(page: Page, text: string) {
  return page.locator(`::-p-text(${text})`);
}
