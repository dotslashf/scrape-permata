const pageScrapper = require('./pageScrapper');

async function scrapePage(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScrapper.login(browser);
  } catch (e) {
    console.error('Browser err', e);
  }
}

module.exports = browserInstance => scrapePage(browserInstance);
