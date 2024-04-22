import { Browser, Page } from "puppeteer";
import { createPage, getLocatorWithText } from "../puppeteer";
import { delay } from "../utils";
import { HASHTAGS } from "../constants";
import path from "path";

export async function run(browser: Browser) {
  const page = await createPage(browser);
  // await restoreCookies(page, "./tiktok-cookies.json");

  await page.goto("https://tiktok.com", { waitUntil: "load" });
  if (!process.env.TIKTOK_USERNAME || !process.env.TIKTOK_PASSWORD)
    throw new Error(
      "Provide your TikTok username and password in the .env file"
    );

  page.setDefaultNavigationTimeout(60_000);

  try {
    await page.waitForSelector("[data-e2e='login-title']", { timeout: 5000 });
    console.log("Not logged in to TikTok");

    // await acceptCookies(page); //doesnt show after

    await login(page, process.env.TIKTOK_USERNAME, process.env.TIKTOK_PASSWORD);
  } catch (error) {
    console.log("Already logged in to TikTok");
    delay(1000);
  }

  await createPost(page);
}

export async function acceptCookies(page: Page) {
  await getLocatorWithText(page, "Accept all").click();
}

export async function login(page: Page, username: string, password: string) {
  getLocatorWithText(page, "Use phone / email / username").click();
  getLocatorWithText(page, "Log in with email or username").click();

  await page.locator("input[name='username']").fill(username);
  await page.locator("input[type='password']").fill(password);

  await delay(1500);
  await page.waitForSelector('button[data-e2e="login-button"]');
  await page.click('button[data-e2e="login-button"]');
}

export async function createPost(page: Page) {
  getLocatorWithText(page, "Upload").click();

  await page.waitForSelector('iframe[data-tt="Upload_index_iframe"]');
  const frameElement = await page.$('iframe[data-tt="Upload_index_iframe"]');
  const frame = await frameElement?.contentFrame();
  const fileInput = await frame?.waitForSelector("input[type=file]");

  const fileName = "IMG_0274.MOV"; //TODO: build a proper system around this
  await fileInput?.uploadFile(`${process.env.PATH_TO_VIDEOS}/${fileName}`);

  await frame?.locator(".public-DraftEditor-content").click();
  await page.keyboard.type(`${path.parse(fileName).name} ${HASHTAGS}`);
}
