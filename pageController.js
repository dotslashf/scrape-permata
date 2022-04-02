const pageScrapper = require('./pageScrapper');

async function scrapePage(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    const page = await pageScrapper.login(browser);
    const cookie = await pageScrapper.getCookies(page);
  } catch (e) {
    console.error('Browser err', e);
  }
}

module.exports = browserInstance => scrapePage(browserInstance);
