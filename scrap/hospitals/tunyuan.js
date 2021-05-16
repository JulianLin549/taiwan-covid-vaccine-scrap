const puppeteer = require('puppeteer');
const baseUrl = "https://w3.tyh.com.tw/WebRegList_Dept.aspx?d=55";

const getData = async () => {
    // Viewport && Window size
    const width = 1375;
    const height = 800;
    const data = [];

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--incognito',
            '--disable-features=site-per-process',
            '--no-sandbox',
            '--single-process',
            '--no-zygote',
            '--disable-setuid-sandbox'
        ],
        defaultViewport: null,
    })
    let page = await browser.newPage();
    await page.setViewport({width: width, height: height});

    await page.goto(baseUrl);
    const baseSelector = '#ctl00_ContentPlaceHolder1_labListDept > table';
    await page.waitForSelector(baseSelector);

    for (let timeSlotIndex = 3; timeSlotIndex <= 4; timeSlotIndex++) {
        for (let dayIndex = 2; dayIndex <= 7; dayIndex++) {
            const contentsEl = await page.$$(baseSelector + ` > tbody > tr:nth-child(${timeSlotIndex}) > td:nth-child(${dayIndex}) > div`)
            if (contentsEl !== null) {
                for (let contentIndex = 1; contentIndex <= contentsEl.length; contentIndex++) {
                    const contentInputEl = await page.$(baseSelector + ` > tbody > tr:nth-child(${timeSlotIndex}) > td:nth-child(${dayIndex}) > div:nth-of-type(${contentIndex}) > input:not(disabled)`);
                    if (contentInputEl !== null) {

                        const content = await page.$eval(baseSelector + ` > tbody > tr:nth-child(${timeSlotIndex}) > td:nth-child(${dayIndex}) > div:nth-of-type(${contentIndex})`, el => el.textContent);
                        const date = content.match(/\d+\/\d+\/\d+/gi)[0];
                        let timeSlot;
                        if (timeSlotIndex === 3) {
                            timeSlot = "早上";
                        } else {
                            timeSlot = "下午";
                        }
                        data.push({date, timeSlot})
                    }

                }
            }

        }
    }

    await browser.close();
    return data;
}

module.exports = getData;
