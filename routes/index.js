import express from "express";
import pa11y from "pa11y";
import edgeChromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { successResponse, errorResponse } from "../utils/pa11y.js";
const app = express();

const defaultIncludes = {
  includeWarnings: true,
  includeNotices: true,
  timeout: 20000,
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/analizar", async (req, res) => {
  const url = req.body.url;
  const actions = req.body.actions;
  const host = req.hostname;
  let successResponseData, browser, page;
  try {
    if (!url) {
      res.status(404).json({
        error: "Sin url",
      });
    }
    if (actions) {
      defaultIncludes.actions = actions
        .split("\n")
        .map((line) => line.replace(/\r$/, ""))
        .filter((line) => line.trim() !== "");
    }
    console.log("🧑‍🏭 Fetching...");
    if (host.includes("localhost") || true) {
      const pa11yResponse = await pa11y(url, {
        ...defaultIncludes,
        chromeLaunchConfig: {
          headless: "new",
        },
      });
      successResponseData = successResponse(pa11yResponse, url);
    } else {
      const executablePath = await edgeChromium.executablePath();
      browser = await puppeteer.launch({
        executablePath,
        args: [...edgeChromium.args, "--disable-extensions"],
        headless: true,
      });
      page = await browser.newPage();
      await page.goto(url);

      const pa11yResponse = await pa11y(url, {
        ignoreUrl: true,
        ...defaultIncludes,
        browser: browser,
        page: page,
      });
      successResponseData = successResponse(pa11yResponse, url);
    }
    console.log("✅ Fetch success ");
    res.status(200).json(successResponseData);
  } catch (error) {
    const errorData = errorResponse(error, url);
    res.status(500).json(errorData);
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
});

export default app;
