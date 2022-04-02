const { Browser, Page } = require('puppeteer');
const readline = require('readline');
const fetch = require('node-fetch');
const ObjectsToCsv = require('objects-to-csv');
require('dotenv').config();

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
  url: `https://www.permatanet.com`,
  mutationUrl: `/pnet/saving-detail/IDR#mutation`,
  mutationFetchUrl: `/services/casa/detailStatement`,
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
    return page;
  },
  /**
   *
   * @param {Page} page
   */
  async getCookies(page) {
    console.log(`Go to mutation url`);
    await page.waitForTimeout(5000);
    await page.goto(`${this.url}${this.mutationUrl}`);
    const cookies = await page.cookies();
    const cookiesString = cookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
    return cookiesString;
  },
  async fetchMutation(cookie) {
    const headers = new fetch.Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json, text/plain, */*');
    headers.append('Cookie', cookie);
    const options = {
      method: 'POST',
      headers,
      redirect: 'follow',
    };

    const years = [2021, 2022];
    for (const year of years) {
      for (const month of [...Array(12).keys()].map(i => i + 1)) {
        const payload = JSON.stringify({
          currCode: 'IDR',
          acctId: process.env.ACC_ID,
          month: month.toString(),
          year: year.toString(),
        });

        const response = await fetch(`${this.url}${this.mutationFetchUrl}`, {
          ...options,
          body: payload,
        });
        const data = await response.json();
        if (data.StatementInfo.TrxRecord.length > 0) {
          const formattedList = data.StatementInfo.TrxRecord.map(trx => {
            return {
              desc: trx.TrxDesc.trim(),
              date: trx.PostDate,
              amount: trx.TrxAmount.Amount,
              status: trx.TrxAmount.BalSign === 'D' ? 'Out' : 'In',
            };
          });
          const csv = new ObjectsToCsv(formattedList);
          await csv.toDisk(`./data/mutation-${year}-${month}.csv`);
        }
      }
    }
  },
};

module.exports = scrapeObject;
