const puppeteer = require('puppeteer-extra');
const saveToDb = require('../saveToDb');
const saveRandom = require("../setRandom");

const url = "https://tyghnetreg.tygh.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=0126&Date=&Noon="

const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    await saveRandom(page);
    try {

        await page.goto(url);

        await page.waitForSelector('#ctl00_ContentPlaceHolder1_iframeRegTable');
        const frame = await page.frames().find(frame => frame.name() === 'iframeRegTable');
        await frame.waitForSelector('#UpdatePanel1');
        const weeksEl = await frame.$$('#RdBtnLstWeek > input ');

        let previousDate = ""
        let currentDate = "";


        for (let weekIndex = 1; weekIndex <= weeksEl.length; weekIndex++) {
            await frame.waitForSelector('#UpdatePanel1');
            const week = await frame.$(`#RdBtnLstWeek > input:nth-of-type(${weekIndex})`);
            await page.waitForTimeout(Math.random() * (500 - 100) + 100);
            await week.click();

            let countdown = 1000;; //1000 * 10 = 100 sec
            while (previousDate === currentDate) {
                if (countdown <= 0) {
                    throw Error("countdown exceed")
                }
                page.waitForTimeout(500);
                currentDate = await frame.$eval(`#SchTable1 > tbody > tr.trRegSchHead > td:nth-child(2)`, el => el.textContent);
                countdown -= 1
            }
            previousDate = currentDate;

            await frame.waitForSelector('#SchTable1 > tbody > tr');
            const daysEl = await frame.$$('#SchTable1 > tbody > tr.trRegSchHead > td');
            for (let dayIndex = 2; dayIndex <= daysEl.length; dayIndex++) {
                for (let timeSlotIndex = 2; timeSlotIndex <= 4; timeSlotIndex++) {
                    const dayTimeEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchHead > td:nth-of-type(${dayIndex})`);
                    let date = await dayTimeEl.evaluate(el => el.textContent);
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
        console.log("衛生福利部桃園醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("衛生福利部桃園醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;
