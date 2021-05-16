const puppeteer = require('puppeteer');
const baseUrls = [
    "https://reg.kmuh.gov.tw/netReg/MainUI.aspx?DeptCodeId=1A&Lang=&RoomCnt=2&TimeRange=1&Name=%E6%96%B0%E5%86%A0%E8%82%BA%E7%82%8E%E7%96%AB%E8%8B%97",
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
        await page.waitForSelector('#divOut');

        const contentEl = await page.$(`#divOut > table > tbody > tr:nth-child(3) > td`);
        if (contentEl !== null) {
            const content = await contentEl.evaluate(el => el.textContent);
            if (!!content.match("目前尚無相關的開診資訊！")) {
                break;
            }
            for (let contentIndex = 2; contentIndex <= 22; contentIndex++) {
                const dateIndex = Math.ceil((contentIndex-1)/3)+2;
                const timeSlotIndex = contentIndex;
                const date = await page.$eval(`#divOut > table > tbody > tr:nth-child(1) > th:nth-child(${dateIndex})`, el => el.textContent);
                const timeSlot = await page.$eval(`#divOut > table > tbody > tr:nth-child(2) > th:nth-child(${timeSlotIndex})`, el => el.textContent);
                const content = await page.$(`#divOut > table > tbody > tr.alternate > td:nth-child(${contentIndex}) > a`);
                if (content !== null){
                    data.push({date, timeSlot})
                }
            }
        }

        const weeksEl = await page.$$('#ctl00_MainContent_ddlWeeks > option');

        for (let weekIndex = 2; weekIndex <= weeksEl.length; weekIndex++) {
            const week = await page.$eval(`#ctl00_MainContent_ddlWeeks > option:nth-of-type(${weekIndex})`, el => el.value)
            await page.select('#ctl00_MainContent_ddlWeeks', week);
            await page.waitForSelector('#divOut > table > tbody > tr:nth-child(3) > td');
            const contentEl = await page.$(`#divOut > table > tbody > tr:nth-child(3) > td`);
            if (contentEl !== null) {
                const content = await contentEl.evaluate(el => el.textContent);
                if (!!content.match("目前尚無相關的開診資訊！")) {
                    break;
                }
                for (let contentIndex = 2; contentIndex <= 22; contentIndex++) {
                    const dateIndex = Math.ceil((contentIndex-1)/3)+2;
                    const timeSlotIndex = contentIndex;
                    const date = await page.$eval(`#divOut > table > tbody > tr:nth-child(1) > th:nth-child(${dateIndex})`, el => el.textContent);
                    const timeSlot = await page.$eval(`#divOut > table > tbody > tr:nth-child(2) > th:nth-child(${timeSlotIndex})`, el => el.textContent);
                    const content = await page.$(`#divOut > table > tbody > tr.alternate > td:nth-child(${contentIndex}) > a`);
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
