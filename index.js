const browser = require('./browser');
const pageController = require('./pageController');

let browserInstance = browser.startBrowser();
pageController(browserInstance);
