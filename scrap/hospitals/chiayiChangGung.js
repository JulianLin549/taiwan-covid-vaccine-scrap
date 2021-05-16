const puppeteer = require('puppeteer');
const baseUrls = [
    "https://register.cgmh.org.tw/Department/6/60990E",
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
        await page.waitForSelector('body > main > div.department > div.section.gray.pb56 > div > table');
        const rowsEl = await page.$$('body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr');

        for (let rowIndex = 1; rowIndex <= rowsEl.length; rowIndex++) {
            const date = await page.$eval(`body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr:nth-child(${rowIndex}) > th`, el => el.textContent);
            const morning = await page.$(`body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr:nth-child(${rowIndex}) > td:nth-of-type(1) > a[class='']`);
            const afternoon = await page.$(`body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr:nth-child(${rowIndex}) > td:nth-of-type(2) > a[class='']`);
            const night = await page.$(`body > main > div.department > div.section.gray.pb56 > div > table > tbody > tr:nth-child(${rowIndex}) > td:nth-of-type(3) > a[class='']`);

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
