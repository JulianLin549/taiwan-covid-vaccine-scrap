const puppeteer = require('puppeteer');
const saveToDb = require('../saveToDb');

const baseUrl = "https://reg-prod.tzuchi-healthcare.org.tw/tchw/HIS5OpdReg/OpdTimeShow?Pass=XD;0022";

const getData = async (browser) => {

    let data = [];
    let page = await browser.newPage();

    try {
        await page.goto(baseUrl);
        await page.waitForSelector('#MainContent_gvOpdList > tbody > tr:nth-child(2)')
        const dateEl = await page.$$('#MainContent_gvOpdList > tbody > tr');
        for (let dayIndex = 2; dayIndex <= dateEl.length; dayIndex++) {

            const date = await page.$eval(`#MainContent_gvOpdList > tbody > tr:nth-child(${dayIndex}) > td:nth-child(1) > span`, el => el.innerText);
            const morning = await page.$eval(`#MainContent_gvOpdList > tbody > tr:nth-child(${dayIndex}) > td:nth-child(2) > span`, el => el.innerText);
            const afternoon = await page.$eval(`#MainContent_gvOpdList > tbody > tr:nth-child(${dayIndex}) > td:nth-child(3) > span`, el => el.innerText);

            if (!morning.match("(預掛額滿)")) {
                data.push({date, timeSlot: "上午"})
            }
            if (!afternoon.match("(預掛額滿)")) {
                data.push({date, timeSlot: "下午"})
            }

        }

        console.log("佛教慈濟醫療財團法人台北慈濟醫院:", data);
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("佛教慈濟醫療財團法人台北慈濟醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;

