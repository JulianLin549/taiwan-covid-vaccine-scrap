const puppeteer = require('puppeteer');
const baseUrls = [
    "https://app.tzuchi.com.tw/tchw/opdreg/OpdTimeShow.aspx?Depart=%E8%87%AA%E8%B2%BBCOVID19%E7%96%AB%E8%8B%97%E9%A0%90%E7%B4%84&HospLoc=3",
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
        await page.waitForSelector('#example');

        const rowsEl = await page.$$('#example > tbody > tr.row');

        for (let rowIndex = 2; rowIndex <= rowsEl.length; rowIndex++) {
            const date = await page.$eval(`#example > tbody > tr:nth-child(${rowIndex}) > td.col`, el => el.textContent)
            const morning = await page.$(`#example > tbody > tr:nth-child(${rowIndex}) > td:nth-child(2) > a`);
            const afternoon = await page.$(`#example > tbody > tr:nth-child(${rowIndex}) > td:nth-child(3) > a`);
            const night = await page.$(`#example > tbody > tr:nth-child(${rowIndex}) > td:nth-child(4) > a`);
            if (morning !== null) {
                data.push({date, timeSlot: '上午'})
            }
            if (afternoon !== null) {
                data.push({date, timeSlot: '下午'})
            }
            if (night !== null) {
                data.push({date, timeSlot: '晚上'})
            }
        }
    }

    await browser.close();
    return data;
}


module.exports = getData;
