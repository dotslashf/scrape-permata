const pageScrapper = require('./pageScrapper');

async function scrapePage(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    await pageScrapper.scraper(browser);
  } catch (e) {
    console.error('Cant launch browser', e);
  }
}

module.exports = browserInstance => scrapePage(browserInstance);
