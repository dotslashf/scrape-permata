const { Browser } = require('puppeteer');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function userInput(field) {
  return new Promise(resolve => {
    rl.question(`Enter ${field}: `, answer => {
      resolve(answer);
    });
  });
}

const scrapeObject = {
  url: `https://www.permatanet.com/`,
  /**
   *
   * @param {Browser} browser
   */
  async login(browser) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}`);
    await page.goto(this.url);
    await page.waitForTimeout(2000);

    const username = await page.$('#username');
    await username.type(await userInput('username'));

    await page.click('#password');
    await page.type('#password', await userInput('password'));

    await page.click('#kaptcha');
    await page.type('#kaptcha', await userInput('captcha'));

    await page.click('#button-login');
    rl.close();
  },
};

module.exports = scrapeObject;
