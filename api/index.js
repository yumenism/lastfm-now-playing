// api/screenshot.js

const playwright = require('playwright-core'); // Usando a versão "core"
const playwrightLambda = require('playwright-aws-lambda'); // Usando versão otimizada para AWS Lambda

module.exports = async function handler(req, res) {
  const URL = 'https://lastfm-now-playing-omega.vercel.app';
  const isProd = !!process.env.AWS_EXECUTION_ENV;

  // Defina o navegador a ser utilizado
  const browserType = isProd ? playwrightLambda.chromium : playwright.chromium; // Usar o Playwright otimizado para Lambda em produção

  try {
    const browser = await browserType.launch({
      args: isProd ? playwrightLambda.args : [], // Usa args específicos para Lambda em produção
      headless: true, // Sempre use headless para ambientes serverless
    });

    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'networkidle2' });
    const screenshot = await page.screenshot({ type: 'png' });

    await browser.close();
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (err) {
    console.error('Erro ao capturar a página:', err);
    res.status(500).send('Erro ao gerar screenshot');
  }
};
