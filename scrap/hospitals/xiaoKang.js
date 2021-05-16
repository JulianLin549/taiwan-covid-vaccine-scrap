const puppeteer = require('puppeteer');
const saveToDb = require('../saveToDb');

const baseUrls = [
    "https://www.kmsh.org.tw/web/BookVaccineSysInter",
];


const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    try {

        for await(baseUrl of baseUrls) {
            await page.goto(baseUrl);
            await page.waitForSelector('#InputBookDate');

            const contentsEl = await page.$$(`#InputBookDate > option`);

            for await (contentEl of contentsEl) {
                const content = await contentEl.evaluate(el => el.textContent);
                const date = content.match(/\d+\-\d+\-\d+/gi)[0];
                const timeSlot = content.match(/上午|下午/gi)[0];
                let totalAvailable = content.match(/總剩餘人數\:\d+/gi)[0];
                totalAvailable = totalAvailable.substring(6);
                let selfPaidAvailable = content.match(/自費剩餘人數\:\d+/gi)[0];
                selfPaidAvailable = selfPaidAvailable.substring(7);
                if (totalAvailable === "0" || totalAvailable === "0") break;
                data.push({date, timeSlot, availability: totalAvailable})
            }
        }
        console.log("高雄市立小港醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("高雄市立小港醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}


module.exports = getData;
