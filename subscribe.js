const puppeteer = require('puppeteer');

// const domainName = 'https://www.ytpals.com';
const domainName = 'https://www.subpals.com';
// const domainName = 'https://www.sonuker.com';

const channelId = 'xx';
const password = 'xx';
const loginUrl = `${domainName}/network-v2/login-final.php?channelid=${channelId}`;
(async () => {
  // add { headless: false } in launch method for debug purpose
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });
  try {
      const page = await browser.newPage();
      const navigationPromise = page.waitForNavigation();
      await page.goto(loginUrl, { waitUntil: 'networkidle2' });
      // const passwordInput = await page.waitForSelector('input[type=password]');
      // await passwordInput.type(password);
      await page.type('input[type=password]', password);
      await page.click('input[type=submit]');
      await navigationPromise;
      
      await page.waitFor('#sp-group-main');
      const element = await page.waitFor('#image-1524687372382 > a');
      //  await page.waitFor('a[onclick="document.starter.submit(); return false;"]');
      // await page.reload();
      console.log(element);
      await element.click();
  } catch (err) {
    console.log('ops', err);
  } finally {
    // await browser.close();
  }
})(); 
