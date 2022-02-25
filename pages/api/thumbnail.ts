import { NextApiRequest, NextApiResponse } from "next";

import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query["url"];
  if (!url || typeof url !== "string")
    return res.status(400).send("url is required");

  let browser = null;
  let rawScreenshot = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 630,
    });
    await page.goto(url, {});

    rawScreenshot = await page.screenshot({});
    await page.close();
  } catch (e) {
    console.error(e);
    res.status(500).send((e as Error).message);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  // Set the s-maxage property which caches the images then on the Vercel edge
  res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
  res.setHeader("Content-Type", "image/png");
  // write the image to the response with the specified Content-Type
  res.end(rawScreenshot);
}
