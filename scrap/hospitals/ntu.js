const puppeteer = require('puppeteer');


const baseUrl = "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T0&Reg=";

const getData = async (browser) => {

    let page = await browser.newPage();
    const data = [];

    await page.goto(baseUrl);
    await page.waitForSelector('#DoctorServiceListInSeveralDays1_GridViewDoctorServiceList');
    const rowsEl = await page.$$(`#DoctorServiceListInSeveralDays1_GridViewDoctorServiceList > tbody > tr`);

    for (let index = 2; index <= rowsEl.length; index++) {
        const availabilityEl = await page.$(`#DoctorServiceListInSeveralDays1_GridViewDoctorServiceList > tbody > tr:nth-child(${index}) > td:nth-child(1)`);
        const dateAndTimeSlotEl = await page.$(`#DoctorServiceListInSeveralDays1_GridViewDoctorServiceList > tbody > tr:nth-child(${index}) > td:nth-child(3)`);
        const availability = await availabilityEl.evaluate(el => el.innerText);
        if (!availability.match("名額已滿")) {
            const dateAndTimeSlot = await dateAndTimeSlotEl.evaluate(el => el.innerText);
            const date = dateAndTimeSlot.split(" ")[0];
            // parts[0] = String(parseInt(parts[0], 10) + 1911);
            // const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10)-1, parseInt(parts[2], 10));
            const timeSlot = dateAndTimeSlot.split(') ')[1];
            data.push({ date, timeSlot  })
        }
    }

    await page.waitForTimeout(process.env.DELAY_TIME);
    await page.close();
    return data;
}

module.exports = getData;
