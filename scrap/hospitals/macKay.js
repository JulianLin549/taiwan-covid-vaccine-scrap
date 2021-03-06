const puppeteer = require('puppeteer-extra');
const saveToDb = require('../saveToDb');
const saveRandom = require("../setRandom");

const baseUrl = "https://www.mmh.org.tw/register_single_doctor.php?depid=75&drcode=O75K";

const getData = async (browser) => {
    // Viewport && Window size
    let data = [];
    let page = await browser.newPage();
    await saveRandom(page);
    try {

        // await page.goto(baseUrl);
        // Configure the navigation timeout
        await page.goto(baseUrl, {
            waitUntil: 'load',
            // Remove the timeout
            timeout: 0
        });
        await page.waitForSelector('#tblSch');
        const dateColumnsEl = await page.$$(`#tblSch > tbody:nth-child(2) > tr`);

        for (let dateIndex = 1; dateIndex <= dateColumnsEl.length; dateIndex++) {
            const dateEl = await page.$(`#tblSch > tbody:nth-child(2) > tr:nth-child(${dateIndex}) > td:nth-child(1)`);
            const morningEl = await page.$$(`#tblSch > tbody:nth-child(2) > tr:nth-child(${dateIndex}) > td:nth-child(2) > a`);
            const afternoonEl = await page.$$(`#tblSch > tbody:nth-child(2) > tr:nth-child(${dateIndex}) > td:nth-child(3) > a`);

            if (dateEl !== null && (morningEl !== null || afternoonEl !== null)) {
                let date = await dateEl.evaluate(el => el.innerHTML)
                // let date = new Date (await dateEl.evaluate(el => el.innerHTML.split("(")[0]));
                if (morningEl.length !== 0) {
                    data.push({date, timeSlot: "早上"})
                }
                if (afternoonEl.length !== 0) {
                    data.push({date, timeSlot: "下午"})
                }
            }

        }
        console.log("馬偕紀念醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("馬偕紀念醫院", data);
    } catch (e) {
        await page.close();
        console.log(e);
    }
}

module.exports = getData;
