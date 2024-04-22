import puppeteer, { Browser, Page } from "puppeteer";

export let page: Page;

export async function createBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo: undefined, // might be useful for debugging
    defaultViewport: null, //so the viewport changes with window size
    args: [
      "--no-sandbox",
      "--disable-notifications",
      `--window-size=${1920},${1080}`,
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

  return page;
}
