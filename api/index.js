const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const path = require('path');

module.exports = async function handler(req, res) {
  const testUrl = 'https://lastfm-now-playing-omega.vercel.app';
  const isProd = !!process.env.AWS_EXECUTION_ENV;

  const executablePath = isProd
    ? await chromium.executablePath
    : puppeteer.executablePath?.() || // fallback for puppeteer-core
      require('puppeteer').executablePath?.() || // fallback if puppeteer installed
      '/usr/bin/google-chrome'; // fallback path if nothing else works

  if (!executablePath) {
    console.error('Executable path is not available');
    return res.status(500).send('Executable path could not be resolved');
  }

  try {
    const browser = await puppeteer.launch({
      args: isProd ? chromium.args : [],
      executablePath,
      headless: isProd ? chromium.headless : 'new', // 'new' for local Chrome >= 112
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
};
