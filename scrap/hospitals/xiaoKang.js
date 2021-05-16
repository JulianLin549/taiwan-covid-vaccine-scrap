const puppeteer = require('puppeteer');
const baseUrls = [
    "https://www.kmsh.org.tw/web/BookVaccineSysInter",
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
        await page.waitForSelector('#InputBookDate');

        const contentsEl = await page.$$(`#InputBookDate > option`);

        for await (contentEl of contentsEl) {
            const content = await contentEl.evaluate(el => el.textContent);
            const date = content.match(/\d+\-\d+\-\d+/gi)[0];
            const timeSlot = content.match(/上午|下午/gi)[0];
            let totalAvailable = content.match(/總剩餘人數\:\d+/gi)[0];
            totalAvailable = totalAvailable.substring(6);
            let selfPaidAvailable = content.match(/自費剩餘人數\:\d+/gi)[0];
            selfPaidAvailable = selfPaidAvailable.substring(7);
            if( totalAvailable === "0" || totalAvailable === "0") break;
            data.push({ date, timeSlot, availability:totalAvailable })
        }
    }

    await browser.close();
    return data;
}


module.exports = getData;
