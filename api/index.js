import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const user = 'yumenism';
  const widgetUrl = `https://${req.headers.host}/index.html?user=${user}`;

  // Log chromium executable path for debugging
  console.log('Chromium executable path:', chromium.executablePath);

  if (!chromium.executablePath) {
    res.status(500).send('Chromium executable path is missing');
    return;
  }

  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      '--no-sandbox',          // Ensure that Chrome can run in Lambda environment
      '--disable-setuid-sandbox' // Additional flags for AWS Lambda compatibility
    ],
    defaultViewport: { width: 320, height: 80 },
    executablePath: chromium.executablePath, // Directly use the executablePath (no await)
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(widgetUrl, { waitUntil: 'networkidle2' });

  const screenshot = await page.screenshot({ type: 'png' });

  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).send(screenshot);
}
