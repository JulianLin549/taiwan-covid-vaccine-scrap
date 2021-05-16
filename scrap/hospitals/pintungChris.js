const puppeteer = require('puppeteer');
const baseUrls = [
    "https://www.ptch.org.tw/network/reg_opdForm.asp?cov19=ET5O#",
];

const getData = async () => {
    // Viewport && Window size
    const width = 1375;
    const height = 800;
    const data = [];

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window-size=${width},${height}`,
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
    await page.setViewport({width: width, height: height});

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
                    if (content.match(/額滿|醫師休假/gi)) {
                        let timeSlot;
                        switch (timeSlotIndex){
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

    await browser.close();
    return data;
}


module.exports = getData;
