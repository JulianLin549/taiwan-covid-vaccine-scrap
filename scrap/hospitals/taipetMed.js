const puppeteer = require('puppeteer-extra');
const saveToDb = require('../saveToDb');
const saveRandom = require("../setRandom");

const baseUrl = "https://www.tmuh.org.tw/service/regist/016/week/";

const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    await saveRandom(page);
    try {
        for (let i = 0; i < 5; i++) {
            await page.goto(baseUrl + i);
            await page.waitForSelector('#form1 > div.container.page-body > div > div.col-sm-10 > div.doctor_div')
            const doctorsEl = await page.$$('#form1 > div.container.page-body > div > div.col-sm-10 > div.doctor_div > div')

            //loop through each day
            for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {

                //loop through each doctor
                for (let doctorIndex = 1; doctorIndex <= doctorsEl.length; doctorIndex++) {
                    //loop through time slot
                    for (let timeSlotIndex = 2; timeSlotIndex <= 4; timeSlotIndex++) {
                        const availEl = await page.$(`#form1 > div.container.page-body > div > div.col-sm-10 > div.doctor_div > div:nth-of-type(${doctorIndex}) > div.col-sm-9.d_calandar >  div:nth-child(${timeSlotIndex}) > div:nth-child(${dayIndex}) > a > div > span.people_num`);
                        if (availEl !== null) {
                            let avail = await availEl.evaluate(el => el.textContent);
                            if (!avail.match("(滿)") && !avail.match("(停診)")) {
                                const date = await page.$eval(`#form1 > div.container.page-body > div > div.col-sm-10 > div.doctor_div > div:nth-of-type(${doctorIndex}) > div.col-sm-9.d_calandar >  div:nth-child(1) > div:nth-child(${dayIndex})`, el => el.innerText);
                                const timeSlot = await page.$eval(`#form1 > div.container.page-body > div > div.col-sm-10 > div.doctor_div > div:nth-of-type(${doctorIndex}) > div.col-sm-9.d_calandar >  div:nth-child(${timeSlotIndex}) > div:nth-child(${dayIndex}) > a`, el => el.childNodes[0].nodeValue)
                                data.push({date, timeSlot})
                            }
                        }
                    }
                }
            }
        }
        console.log("臺北醫學大學附設醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("臺北醫學大學附設醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;

