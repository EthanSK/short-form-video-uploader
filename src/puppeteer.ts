import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs-extra";

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

export async function clickWithText(
  page: Page,
  selector: "button" | "a" | "div",
  text: string
) {
  await page.evaluate(
    (selector, text) => {
      const elementsMatchingSelector = Array.from(
        document.querySelectorAll(selector)
      );
      const matchingElement = elementsMatchingSelector.find((e) =>
        e.textContent?.includes(text)
      );
      if (matchingElement) matchingElement.click();
    },
    selector,
    text
  );
}

export async function typeInTextField(
  page: Page,
  selector: string,
  text: string
) {
  await page.waitForSelector(selector);

  await page.focus(selector);
  await page.type(selector, text);
}
