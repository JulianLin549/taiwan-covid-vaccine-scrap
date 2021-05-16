const puppeteer = require('puppeteer');
const baseUrls = [
    "https://flw.stm.org.tw/reg/Home/DrChoose?deptGrouptID=CV&ran=f",
    "https://flw.stm.org.tw/reg/Home/DrChoose?deptGrouptID=CV&ran=s",
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
        const baseSelector = "#page-wrapper > div:nth-child(2) > div > div > div.panel-body > div.col-xs-12.table-responsive > ";
        await page.waitForSelector(baseSelector + 'table.table.table-bordered.table-striped.tab01');
        const tablesEl = await page.$$(baseSelector + 'table');

        for (let tableIndex = 1; tableIndex <= tablesEl.length; tableIndex++) {
            for (let timeSlotIndex = 1; timeSlotIndex <= 3; timeSlotIndex++) {
                for (let dayIndex = 2; dayIndex <= 8; dayIndex++) {
                    const availability = await page.$(baseSelector + `table:nth-of-type(${tableIndex}) > tbody > tr:nth-child(${timeSlotIndex}) > td:nth-child(${dayIndex}) > ul > li > a`)
                    const date = await page.$eval(baseSelector + `table:nth-of-type(${tableIndex}) > thead > tr > th:nth-child(${dayIndex})`, el => el.textContent);
                    const timeSlot = await page.$eval(baseSelector + `table:nth-of-type(${tableIndex}) > tbody > tr:nth-child(${timeSlotIndex}) > td.titleclass`, el => el.textContent);
                    if (availability !== null) {
                        data.push({ date, timeSlot })
                    }
                }
            }
        }
    }


    await browser.close();
    return data;
}

module.exports = getData;
