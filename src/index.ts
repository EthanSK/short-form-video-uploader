import puppeteer from "puppeteer";
import { createBrowser, createPage } from "./puppeteer";
import fs from "fs-extra";
import dotenv from "dotenv";
import { run as runIgReels } from "./platforms/ig-reels";

dotenv.config();

(async () => {
  const browser = await createBrowser();
  try {
    runIgReels(browser);
  } catch (error) {
    console.error("Error: ", error);
  }
})();
