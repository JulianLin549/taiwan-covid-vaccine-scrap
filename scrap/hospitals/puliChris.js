const puppeteer = require('puppeteer-extra');
const saveToDb = require('../saveToDb');
const saveRandom = require("../setRandom");

const baseUrl = "http://web2.pch.org.tw/Booking/Covid19Reg/Covid19Reg.aspx";

const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    await saveRandom(page);
    try {

        await page.goto(baseUrl);
        await page.waitForSelector('#ddlSchd');
        const rowsEl = await page.$$(`#ddlSchd > option`);

        for await (rowEl of rowsEl) {
            const row = await rowEl.evaluate(el => el.innerText);
            if (!row.match(/\(額滿\)/gi)) {
                const date = row.match(/\d+\/\d+\/\d+\([一二三四五六日]\)/gi)[0];
                const timeSlot = row.match(/早上|下午/gi);
                data.push({date, timeSlot})
            }
        }
        console.log("埔基醫療財團法人埔里基督教醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("埔基醫療財團法人埔里基督教醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;
