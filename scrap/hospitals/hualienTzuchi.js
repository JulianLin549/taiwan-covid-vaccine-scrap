const puppeteer = require('puppeteer-extra');
const saveToDb = require('../saveToDb');
const saveRandom = require("../setRandom");

const baseUrls = [
    "https://app.tzuchi.com.tw/tchw/opdreg/OpdTimeShow.aspx?Depart=%E8%87%AA%E8%B2%BBCOVID19%E7%96%AB%E8%8B%97%E9%A0%90%E7%B4%84&HospLoc=3",
];

const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    await saveRandom(page);
    try {

    for await(baseUrl of baseUrls) {
        await page.goto(baseUrl);
        await page.waitForSelector('#example');

        const rowsEl = await page.$$('#example > tbody > tr.row');

        for (let rowIndex = 2; rowIndex <= rowsEl.length; rowIndex++) {
            const date = await page.$eval(`#example > tbody > tr:nth-child(${rowIndex}) > td.col`, el => el.textContent)
            const morning = await page.$(`#example > tbody > tr:nth-child(${rowIndex}) > td:nth-child(2) > a`);
            const afternoon = await page.$(`#example > tbody > tr:nth-child(${rowIndex}) > td:nth-child(3) > a`);
            const night = await page.$(`#example > tbody > tr:nth-child(${rowIndex}) > td:nth-child(4) > a`);
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
        console.log("佛教慈濟醫療財團法人花蓮慈濟醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("佛教慈濟醫療財團法人花蓮慈濟醫院:", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}


module.exports = getData;
