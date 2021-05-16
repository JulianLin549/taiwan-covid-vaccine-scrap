const puppeteer = require('puppeteer');
const saveToDb = require('../saveToDb');

const baseUrls = [
    "https://www.ptch.org.tw/network/reg_opdForm.asp?cov19=ET5O#",
];

const getData = async (browser) => {
    let data = [];
    let page = await browser.newPage();
    try {

        for await(baseUrl of baseUrls) {
            await page.goto(baseUrl);
            const baseSelector = "body > form > table:nth-child(8) > tbody > tr:nth-child(5) > td > table > tbody > tr > td > table";
            await page.waitForSelector(baseSelector);
            let doctorLinks = await page.$$(baseSelector + ' > tbody > tr > td > a');

            for (let timeSlotIndex = 2; timeSlotIndex <= 4; timeSlotIndex++) {
                for (let dayIndex = 2; dayIndex <= 7; dayIndex++) {
                    await page.waitForSelector(baseSelector);

                    const doctorBtn = await page.$(baseSelector + `> tbody > tr:nth-child(${timeSlotIndex}) > td:nth-child(${dayIndex}) > a`);
                    if (doctorBtn === null) {
                        continue;
                    }
                    await doctorBtn.click();
                    await page.waitForSelector('#choice > table > tbody > tr:nth-child(5) > td:nth-child(1) > input[type=button]');

                    const rowsEl = await page.$$(' #choice > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > table > tbody > tr');

                    for (let rowIndex = 2; rowIndex <= rowsEl.length; rowIndex++) {
                        const content = await page.$eval(`#choice > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td > table > tbody > tr:nth-child(${rowIndex}) > td:nth-child(2)`, el => el.innerText);
                        const date = content.match(/\d+\/\d+\/\d+/gi)[0];
                        if (!content.match(/額滿|醫師休假/gi)) {
                            let timeSlot;
                            switch (timeSlotIndex) {
                                case 2:
                                    timeSlot = '早上';
                                    break;
                                case 3:
                                    timeSlot = '下午';
                                    break;
                                default:
                                    timeSlot = "晚上";
                            }
                            data.push({date, timeSlot});
                        }
                    }


                    const back = await page.$('#choice > table > tbody > tr:nth-child(5) > td:nth-child(1) > input[type=button]')
                    await back.click();

                }
            }
        }
        console.log("屏基醫療財團法人屏東基督教醫院:", data)
        await page.waitForTimeout(process.env.DELAY_TIME);
        await page.close();
        await saveToDb("屏基醫療財團法人屏東基督教醫院", data);
    } catch (e) {
        await page.close();
        console.log(e.message);
    }

}


module.exports = getData;
