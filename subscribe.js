const puppeteer = require('puppeteer');

const gmail = 'xx';
const gmailPassword = 'xx';

// const domainName = 'https://www.ytpals.com';
const domainName = 'https://www.subpals.com';
// const domainName = 'https://www.sonuker.com';
const googleLoginUrl = 'https://accounts.google.com/login?hl=en';

const channelId = 'xx';
const password = 'xx';
const loginUrl = `${domainName}/network-v2/login-final.php?channelid=${channelId}`;

const googleLogin = async (browser) => {
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();

  await page.goto(googleLoginUrl, { waitUntil: 'networkidle2' });

  await page.waitForSelector('input[type=email]');
  await page.type('input[type=email]', gmail);
  await page.click('span.snByac');
  await navigationPromise;

  await page.waitForSelector('input[type=password]', { visible: true });
  await page.type('input[type=password]', gmailPassword);
  await page.click('span.snByac');
  await navigationPromise;
  await page.goto('https://youtube.com');
  await navigationPromise;
};
(async () => {
  // add { headless: false } in launch method for debug purpose
  // const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-infobars', '--disable-setuid-sandbox']
  });
  try {
    // await googleLogin(browser);
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation();
    await page.goto('https://youtube.com');
    /*
    await page.goto(loginUrl, { waitUntil: 'networkidle2' });
    // const passwordInput = await page.waitForSelector('input[type=password]');
    // await passwordInput.type(password);
    await page.type('input[type=password]', password);
    await page.click('input[type=submit]');
    await navigationPromise;


    // const element = await page.waitForSelector('img#likeSub1');

    await page.goto('https://www.subpals.com/network-v2/index.php', { waitUntil: 'networkidle2' });

    await navigationPromise;

    await page.waitForSelector('a#likeSub2');
    await page.evaluate(() => {
      const node = document.querySelector('a#likeSub2');
      console.log(node);
      node.click();
    });
*/
    console.log(1);
  } catch (err) {
    console.log('ops', err);
  } finally {
    // await browser.close();
  }
})();
