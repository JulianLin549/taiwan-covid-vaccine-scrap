const puppeteer = require('puppeteer-extra');
const saveToDb = require('../saveToDb');
const saveRandom = require("../setRandom");

const urls = ["https://reg2.mil.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=CO11&Date=&Noon=",
    "https://reg2.mil.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=CO41&Date=&Noon=",
    "https://reg2.mil.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=CO23&Date=&Noon="]


const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    await saveRandom(page);
    try {

        for await (url of urls) {
            await page.waitForTimeout(Math.random() * (700 - 100) + 100);
            await page.goto(url);
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_iframeRegTable');
            const frame = await page.frames().find(frame => frame.name() === 'iframeRegTable');
            await frame.waitForSelector('#UpdatePanel1');
            const weeksEl = await frame.$$('#SchTableDiv > table > tbody');

            for (let weekIndex = 1; weekIndex <= weeksEl.length; weekIndex++) {
                for (let dayIndex = 2; dayIndex <= 7; dayIndex++) {
                    for (let timeSlotIndex = 2; timeSlotIndex <= 4; timeSlotIndex++) {

                        const date = await frame.$eval(`#SchTableDiv > table:nth-of-type(${weekIndex}) > tbody > tr.trRegSchHead > td:nth-of-type(${dayIndex})`, el => el.textContent);
                        const timeSlotEl = await frame.$(`#SchTable1 > tbody > tr:nth-child(${timeSlotIndex}) > td:nth-child(1)`);

                        const innerTextEl = await frame.$(`#SchTable1 > tbody > tr:nth-child(${timeSlotIndex}) > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);

                        if (innerTextEl !== null) {
                            const innerText = await innerTextEl.evaluate(el => el.innerText);
                            if (innerText.match(/\([0-9]+\)/gi)) {
                                const availability = innerText.match(/[0-9]+/gi)[0];
                                const timeSlot = await timeSlotEl.evaluate(el => el.innerText);
                                data.push({date, timeSlot, availability})
                            }
                        }
                    }
                }

            }
        }
        console.log("衛生福利部苗栗醫院:", data);
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("衛生福利部苗栗醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;
