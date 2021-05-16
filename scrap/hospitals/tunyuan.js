const puppeteer = require('puppeteer');
const saveToDb = require('../saveToDb');

const baseUrl = "https://w3.tyh.com.tw/WebRegList_Dept.aspx?d=55";

const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    try {

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
        console.log("東元醫療社團法人東元綜合醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("東元醫療社團法人東元綜合醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;
