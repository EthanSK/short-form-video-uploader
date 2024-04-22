import { Browser, Page } from "puppeteer";
import { clickWithText, createPage, typeInTextField } from "../puppeteer";
import { delay } from "../utils";

export async function run(browser: Browser) {
  const page = await createPage(browser);
  await page.goto("https://instagram.com", { waitUntil: "load" });
  if (!process.env.INSTAGRAM_USERNAME || !process.env.INSTAGRAM_PASSWORD)
    throw new Error(
      "Provide your Instagram username and password in the .env file"
    );

  await acceptCookies(page);
  await login(
    page,
    process.env.INSTAGRAM_USERNAME,
    process.env.INSTAGRAM_PASSWORD
  );
}

export async function acceptCookies(page: Page) {
  delay(2000);
  await clickWithText(page, "button", "Allow all cookies");
}

export async function login(page: Page, username: string, password: string) {
  await typeInTextField(page, "input[name='username']", username);
  await typeInTextField(page, "input[name='password']", password);
  await clickWithText(page, "div", "Log in");
}
