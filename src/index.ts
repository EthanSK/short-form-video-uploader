import puppeteer from "puppeteer";
import { createBrowser, createPage } from "./puppeteer";
import fs from "fs-extra";
import dotenv from "dotenv";
import { run as runIgReels } from "./platforms/ig-reels";
import { run as runTikTok } from "./platforms/tiktok";

dotenv.config();

(async () => {
  const browser = await createBrowser();
  try {
    // runIgReels(browser);
    runTikTok(browser);
  } catch (error) {
    console.error("Error: ", error);
  }
})();
