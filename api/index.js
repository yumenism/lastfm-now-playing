import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import { executablePath as localExecutablePath } from 'puppeteer'; // Fallback

export default async function handler(req, res) {
  const testUrl =https:'https://lastfm-now-playing-omega.vercel.app';
  const isProd = !!process.env.AWS_EXECUTION_ENV; // True on real Vercel Lambda

  const executablePath = isProd
    ? await chromium.executablePath
    : localExecutablePath(); // fallback for dev/local

  if (!executablePath) {
    console.error('Executable path is not available');
    res.status(500).send('Executable path could not be resolved');
    return;
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
      defaultViewport: { width: 320, height: 80 },
    });

    const page = await browser.newPage();
    await page.goto(testUrl, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ type: 'png' });

    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(screenshot);
  } catch (error) {
    console.error('Error during Puppeteer operation:', error);
    res.status(500).send('Error during Puppeteer operation');
  }
}
