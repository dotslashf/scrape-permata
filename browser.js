const puppeteer = require('puppeteer');

async function startBrowser() {
  let browser;
  try {
    console.log('Starting browser...');
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
  } catch (e) {
    console.error('Cant launch browser', e);
  }
  return browser;
}

module.exports = {
  startBrowser,
};
