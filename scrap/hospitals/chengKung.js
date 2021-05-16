const puppeteer = require('puppeteer');
const baseUrls = [
    "https://service.hosp.ncku.edu.tw/Tandem/MainUI.aspx?Lang=&skv=EzNec8%2bb3OYprHkqM83gBiNJ2d6GNAz2gvscJU0dxqw%3d",
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
        await page.waitForSelector('#tRegSchedule');

        const contentEl = await page.$(`#tRegSchedule > tbody > tr > td`);
        if (contentEl !== null) {
            const content = await contentEl.evaluate(el => el.textContent);
            if (!!content.match("目前尚無相關的開診資訊！")) {
                break;
            }
        }
        for (let contentIndex = 3; contentIndex <= 14; contentIndex++) {
            const dateIndex = Math.ceil((contentIndex-2)/2)+2;
            const timeSlotIndex = contentIndex - 1;
            const date = await page.$eval(`#thMainHead > tr:nth-child(1) > th:nth-of-type(${dateIndex})`, el => el.textContent);
            const timeSlot = await page.$eval(`#thMainHead > tr:nth-child(2) > th:nth-of-type(${timeSlotIndex})`, el => el.textContent);

            const content = await page.$(`#tRegSchedule > tbody > tr > td:nth-child(${contentIndex}) > a`);
            if (content !== null){
                data.push({date, timeSlot})
            }

        }
        const weeksEl = await page.$$('#ctl00_MainContent_ddlWeeks > option');

        for (let weekIndex = 2; weekIndex <= weeksEl.length; weekIndex++) {
            const week = await page.$eval(`#ctl00_MainContent_ddlWeeks > option:nth-of-type(${weekIndex})`, el => el.value)
            await page.select('#ctl00_MainContent_ddlWeeks', week);
            await page.waitForSelector('#tRegSchedule > tbody > tr > td');
            const contentEl = await page.$(`#tRegSchedule > tbody > tr > td`);
            if (contentEl !== null) {
                const content = await contentEl.evaluate(el => el.textContent);
                if (!!content.match("目前尚無相關的開診資訊！")) {
                    break;
                }
                for (let contentIndex = 3; contentIndex <= 14; contentIndex++) {
                    const dateIndex = Math.ceil((contentIndex-2)/2)+2;
                    const timeSlotIndex = contentIndex - 1;
                    const date = await page.$eval(`#thMainHead > tr:nth-child(1) > th:nth-of-type(${dateIndex})`, el => el.textContent);
                    const timeSlot = await page.$eval(`#thMainHead > tr:nth-child(2) > th:nth-of-type(${timeSlotIndex})`, el => el.textContent);

                    const content = await page.$(`#tRegSchedule > tbody > tr > td:nth-child(${contentIndex}) > a`);
                    if (content !== null){
                        data.push({date, timeSlot})
                    }

                }
            }
        }
    }

    await browser.close();
    return data;
}


module.exports = getData;
