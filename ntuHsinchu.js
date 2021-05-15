const puppeteer = require('puppeteer');
const baseUrl = "https://reg.ntuh.gov.tw/WebAdministration/VaccineRegPublic.aspx?Hosp=T4&RegionCode=";

const getData = async () => {
    // Viewport && Window size
    const width = 1375;
    const height = 800;
    const data = [];

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window-size=${ width },${ height }`,
            '--disable-features=site-per-process',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
        defaultViewport: {
            width,
            height
        },
    })


    let page = await browser.newPage();
    await page.setViewport({ width: width, height: height });

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

    await browser.close();
    return data;
}

module.exports = getData;
