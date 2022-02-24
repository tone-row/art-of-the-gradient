import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query["url"];
  if (!url || typeof url !== "string")
    return res.status(400).send("url is required");

  const executablePath = await chromium.executablePath;

  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 630,
    },
  });

  await page.goto(url, {
    timeout: 15 * 1000,
  });
  const data = await page.screenshot({
    type: "png",
  });
  await browser.close();

  // Set the s-maxage property which caches the images then on the Vercel edge
  res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
  res.setHeader("Content-Type", "image/png");
  // write the image to the response with the specified Content-Type
  res.end(data);
}
