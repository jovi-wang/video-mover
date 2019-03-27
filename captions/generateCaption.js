const puppeteer = require('puppeteer');
const parser = require('fast-xml-parser');
const fs = require('fs');

const format = milliseconds => {
  const date = new Date(null);
  date.setMilliseconds(milliseconds);
  const result = date.toISOString().substr(11, 12);
  return result;
};
const captionTimeSpan = 1500;

const generateCaptionFiles = async (browser, cidList) => {
  try {
    const page = await browser.newPage();
    for (let p = 0; p < cidList.length; p += 1) {
      const { cid, title } = cidList[p];
      // https://comment.bilibili.com/{cid}.xml
      // https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}
      const response = await page.goto(`https://comment.bilibili.com/${cid}.xml`);
      const xmlData = await response.text();
      const json = parser.parse(xmlData, { ignoreAttributes: false, attributeNamePrefix: '', textNodeName: 'value' });
      // console.log(json.i.d);
      const captionsArray = Array.from(json.i.d)
        .map(i => ({
          value: i.value,
          timestampt: Math.round(1000 * Number(i.p.split(',')[0])),
        }))
        .sort((a, b) => a.timestampt - b.timestampt);
      // .map(i => ({ startTime: format(i.timestampt), stopTime: format(i.timestampt + 500), ...i }));
      // construct sbv file, 1st round
      for (let i = 1; i < captionsArray.length; i += 1) {
        // console.log(captionsArray[i]);
        const currentCaption = captionsArray[i];
        const previousCaption = captionsArray[i - 1];
        // console.log('current', currentCaption.timestampt, 'previous', previousCaption.timestampt);
        // if time difference is too small
        if (currentCaption.timestampt - previousCaption.timestampt < captionTimeSpan) {
          previousCaption.value += `\n${currentCaption.value}`;
          captionsArray.splice(i, 1);
        }
      }
      // construct sbv file, 2nd round
      for (let i = 1; i < captionsArray.length; i += 1) {
        // console.log(captionsArray[i]);
        const currentCaption = captionsArray[i];
        const previousCaption = captionsArray[i - 1];
        // console.log('current', currentCaption.timestampt, 'previous', previousCaption.timestampt);
        // if time difference is too small
        if (currentCaption.timestampt - previousCaption.timestampt < captionTimeSpan) {
          previousCaption.value += `\n${currentCaption.value}`;
          captionsArray.splice(i, 1);
        }
      }
      const currentCaptionsList = fs.readdirSync(__dirname);
      captionsArray
        .map(i => ({
          startTime: format(i.timestampt),
          stopTime: format(i.timestampt + captionTimeSpan),
          ...i,
        }))
        .forEach(i => {
          // remove old version of caption file
          if (currentCaptionsList.includes(`${__dirname}/${title}.sbv`)) {
            fs.unlinkSync(`${__dirname}/${title}.sbv`);
          }
          fs.appendFileSync(`${__dirname}/${title}.sbv`, `${i.startTime},${i.stopTime}\n${i.value}\n\n`);
        });
    }
  } catch (err) {
    console.log('error in generateCaptionFile', err);
    throw err;
  }
};

(async () => {
  // add { headless: false } in launch method for debug purpose
  const browser = await puppeteer.launch();
  try {
    const aidList = [23430199, 24335656, 24030433];

    for (const aid of aidList) {
      const tab = await browser.newPage();
      const response = await tab.goto(`https://api.bilibili.com/x/web-interface/view?aid=${aid}`);
      const resText = await response.text();
      const { data } = JSON.parse(resText);
      const cidList = [];
      const { title, pages } = data;
      for (let i = 0; i < pages.length; i += 1) {
        const page = pages[i];
        const captionName = `${aid}-${title}-${page.page}-${page.cid}`;
        cidList.push({ cid: page.cid, title: captionName });
      }
      await generateCaptionFiles(browser, cidList);
    }
  } catch (err) {
    console.log('ops', err);
  } finally {
    await browser.close();
  }
})();
