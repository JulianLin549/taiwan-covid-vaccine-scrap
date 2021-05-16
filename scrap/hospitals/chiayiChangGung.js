const puppeteer = require('puppeteer');
const saveToDb = require('../saveToDb');

const baseUrls = [
    "https://register.cgmh.org.tw/Department/6/60990E",
];

const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    try {

        for await(baseUrl of baseUrls) {
            await page.goto(baseUrl);
            await page.waitForSelector('body > main > div.department > div.section.gray.pb56 > div > table');
            const rowsEl = await page.$$('body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr');

            for (let rowIndex = 1; rowIndex <= rowsEl.length; rowIndex++) {
                const date = await page.$eval(`body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr:nth-child(${rowIndex}) > th`, el => el.textContent);
                const morning = await page.$(`body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr:nth-child(${rowIndex}) > td:nth-of-type(1) > a[class='']`);
                const afternoon = await page.$(`body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr:nth-child(${rowIndex}) > td:nth-of-type(2) > a[class='']`);
                const night = await page.$(`body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr:nth-child(${rowIndex}) > td:nth-of-type(3) > a[class='']`);

                if (morning !== null) {
                    data.push({date, timeSlot: '上午'})
                }
                if (afternoon !== null) {
                    data.push({date, timeSlot: '下午'})
                }
                if (night !== null) {
                    data.push({date, timeSlot: '晚上'})
                }


            }
        }
        console.log("長庚醫療財團法人嘉義長庚紀念醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("長庚醫療財團法人嘉義長庚紀念醫院:", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;
