const puppeteer = require('puppeteer-extra');
const saveToDb = require('../saveToDb');
const saveRandom = require("../setRandom");


const baseUrl = "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=Y0&Reg=";

const getData = async (browser) => {

    let data = [];
    let page = await browser.newPage();
    await saveRandom(page);

    try {

        await page.goto(baseUrl);
        await page.waitForSelector('#DoctorServiceListInSeveralDays1_GridViewDoctorServiceList');
        const rowsEl = await page.$$(`#DoctorServiceListInSeveralDays1_GridViewDoctorServiceList > tbody > tr`);

        for (let index = 2; index <= rowsEl.length; index++) {
            const availabilityEl = await page.$(`#DoctorServiceListInSeveralDays1_GridViewDoctorServiceList > tbody > tr:nth-child(${index}) > td:nth-child(1)`);
            const dateAndTimeSlotEl = await page.$(`#DoctorServiceListInSeveralDays1_GridViewDoctorServiceList > tbody > tr:nth-child(${index}) > td:nth-child(3)`);
            const availability = await availabilityEl.evaluate(el => el.innerText);

            if (!availability.match("名額已滿") && !availability.match("停止掛號")) {
                const dateAndTimeSlot = await dateAndTimeSlotEl.evaluate(el => el.innerText);
                const date = dateAndTimeSlot.split(" ")[0];
                const timeSlot = dateAndTimeSlot.split(') ')[1];
                data.push({date, timeSlot})
            }
        }
        console.log("國立臺灣大學醫學院附設醫院雲林分院:", data);
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("國立臺灣大學醫學院附設醫院雲林分院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }
}

module.exports = getData;
