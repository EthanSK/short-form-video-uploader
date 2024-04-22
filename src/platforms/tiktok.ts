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

    try {
      await acceptCookies(page);
    } catch (error) {}

    await login(page, process.env.TIKTOK_USERNAME, process.env.TIKTOK_PASSWORD);
  } catch (error) {
    console.log("Already logged in to TikTok");
    delay(1000);
  }

  await page.waitForNavigation({ waitUntil: "networkidle0" });

  await createPost(page);
}

export async function acceptCookies(page: Page) {
  await getLocatorWithText(page, "Accept all").click();
}

export async function login(page: Page, username: string, password: string) {
  await getLocatorWithText(page, "Use phone / email / username").click();
  await getLocatorWithText(page, "Log in with email or username").click();

  await page.locator("input[name='username']").fill(username);
  await page.locator("input[type='password']").fill(password);

  await delay(1500);
  await page.waitForSelector('button[data-e2e="login-button"]');
  await page.click('button[data-e2e="login-button"]');
}

export async function createPost(page: Page) {
  await getLocatorWithText(page, "Upload").click();

  await page.waitForSelector('iframe[data-tt="Upload_index_iframe"]');
  const frameElement = await page.$('iframe[data-tt="Upload_index_iframe"]');
  const frame = await frameElement?.contentFrame();
  const fileInput = await frame?.waitForSelector("input[type=file]");

  const fileName = "IMG_0289.MOV"; //TODO: build a proper system around this
  await fileInput?.uploadFile(`${process.env.PATH_TO_VIDEOS}/${fileName}`);

  await frame?.locator(".public-DraftEditor-content").click();
  for (let i = 0; i < 420; i++) {
    await page.keyboard.press("Backspace");
  }
  await page.keyboard.type(`${path.parse(fileName).name} ${HASHTAGS}`);

  const duetLabel = await frame?.waitForSelector("label ::-p-text(Duet)");
  (await duetLabel?.waitForSelector("::-p-xpath(..)"))?.click();

  const stitchLabel = await frame?.waitForSelector("label ::-p-text(Stitch)");
  (await stitchLabel?.waitForSelector("::-p-xpath(..)"))?.click();

  const aiGeneratedLabel = await frame?.waitForSelector(
    "::-p-text(AI-generated content)"
  );
  const aiGenParent = await aiGeneratedLabel?.waitForSelector("::-p-xpath(..)");
  (await aiGenParent?.waitForSelector("input[type=checkbox]"))?.click();
  try {
    await frame
      ?.locator('button ::-p-text("Turn on")')
      .setTimeout(1000)
      .click();
  } catch (error) {
    console.log("AI-generated content extra turn on already pressed");
  }

  await frame
    ?.locator("button ::-p-text(Post)::-p-xpath(..)::-p-xpath(..)")
    .setWaitForEnabled(true)
    .click();

  await frame?.locator("button ::-p-text(Manage your posts)").click();

  await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 120_000 });
}
