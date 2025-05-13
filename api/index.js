import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {

  const user = 'yumenism';
  const widgetUrl = `https://${req.headers.host}/index.html?user=${user}`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 320, height: 80 },
    executablePath: await chromium.executablePath(),
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
