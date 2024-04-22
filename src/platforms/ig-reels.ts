import { Browser, Page } from "puppeteer";
import { createPage, getLocatorWithText } from "../puppeteer";
import { delay } from "../utils";
import { HASHTAGS } from "../constants";
import path from "path";

export async function run(browser: Browser) {
  const page = await createPage(browser);
  await page.goto("https://instagram.com", { waitUntil: "load" });
  if (!process.env.INSTAGRAM_USERNAME || !process.env.INSTAGRAM_PASSWORD)
    throw new Error(
      "Provide your Instagram username and password in the .env file"
    );

  try {
    await page.waitForSelector("::-p-text(Create)", { timeout: 10000 });
    console.log("Already logged in to Instagram");
    delay(4000);
  } catch (error) {
    console.log("Not logged in to Instagram");
    await acceptCookies(page);

    await login(
      page,
      process.env.INSTAGRAM_USERNAME,
      process.env.INSTAGRAM_PASSWORD
    );
  }

  await createPost(page);
}

export async function acceptCookies(page: Page) {
  await getLocatorWithText(page, "Allow all cookies").click();
}

export async function login(page: Page, username: string, password: string) {
  await page
    .locator("input[name='username']")
    .setWaitForStableBoundingBox(true)
    .fill(username);
  await page
    .locator("input[name='password']")
    .setWaitForStableBoundingBox(true)
    .fill(password);

  await delay(1500);
  await page.waitForSelector('button[type="submit"]');
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: "networkidle0" });
}

export async function createPost(page: Page) {
  getLocatorWithText(page, "Create").click();
  const fileInput = await page.waitForSelector('input[type="file"]');
  const fileName = "IMG_0289.MOV"; //TODO: build a proper system around this
  await fileInput?.uploadFile(`${process.env.PATH_TO_VIDEOS}/${fileName}`);
  getLocatorWithText(page, "OK").click();

  await delay(2000);
  const selectCropButton = await page.waitForSelector(
    'button [aria-label="Select Crop"]'
  );
  await selectCropButton?.click();

  await getLocatorWithText(page, "9:16").click();

  await getLocatorWithText(page, "Next").click();
  await getLocatorWithText(page, "Next").click();
  await page.waitForSelector('div[contenteditable="true"]');

  // Click the div to focus
  await page.click('div[contenteditable="true"]');

  // Type into the focused contenteditable div
  await page.keyboard.type(`${path.parse(fileName).name} ${HASHTAGS}`);

  await getLocatorWithText(page, "Share").click();

  await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 120_000 });
}
