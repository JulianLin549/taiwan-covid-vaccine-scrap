const puppeteer = require('puppeteer');
const saveToDb = require('../saveToDb');

const baseUrls = [
    "https://flw.stm.org.tw/reg/Home/DrChoose?deptGrouptID=CV&ran=f",
    "https://flw.stm.org.tw/reg/Home/DrChoose?deptGrouptID=CV&ran=s",
];

const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();

    try {

        for await(baseUrl of baseUrls) {
            await page.goto(baseUrl);
            const baseSelector = "#page-wrapper > div:nth-child(2) > div > div > div.panel-body > div.col-xs-12.table-responsive > ";
            await page.waitForSelector(baseSelector + 'table.table.table-bordered.table-striped.tab01');
            const tablesEl = await page.$$(baseSelector + 'table');

            for (let tableIndex = 1; tableIndex <= tablesEl.length; tableIndex++) {
                for (let timeSlotIndex = 1; timeSlotIndex <= 3; timeSlotIndex++) {
                    for (let dayIndex = 2; dayIndex <= 8; dayIndex++) {
                        const availability = await page.$(baseSelector + `table:nth-of-type(${tableIndex}) > tbody > tr:nth-child(${timeSlotIndex}) > td:nth-child(${dayIndex}) > ul > li > a`)
                        const date = await page.$eval(baseSelector + `table:nth-of-type(${tableIndex}) > thead > tr > th:nth-child(${dayIndex})`, el => el.textContent);
                        const timeSlot = await page.$eval(baseSelector + `table:nth-of-type(${tableIndex}) > tbody > tr:nth-child(${timeSlotIndex}) > td.titleclass`, el => el.textContent);
                        if (availability !== null) {
                            data.push({date, timeSlot})
                        }
                    }
                }
            }
        }
        console.log("天主教中華聖母修女會醫療財團法人天主教聖馬爾定醫院:", data);
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("天主教中華聖母修女會醫療財團法人天主教聖馬爾定醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;
