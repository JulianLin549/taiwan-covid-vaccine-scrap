const puppeteer = require('puppeteer');

const baseUrl = "https://reg-prod.tzuchi-healthcare.org.tw/tchw/HIS5OpdReg/OpdTimeShow?Pass=XD;0022";

const getData = async () => {

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

    await page.goto(baseUrl);
    await page.waitForSelector('#MainContent_gvOpdList > tbody > tr:nth-child(2)')
    const dateEl = await page.$$('#MainContent_gvOpdList > tbody > tr');
    for (let dayIndex = 2; dayIndex <= dateEl.length; dayIndex++) {

        const date = await page.$eval(`#MainContent_gvOpdList > tbody > tr:nth-child(${dayIndex}) > td:nth-child(1) > span`, el => el.innerText);
        const morning = await page.$eval(`#MainContent_gvOpdList > tbody > tr:nth-child(${dayIndex}) > td:nth-child(2) > span`, el => el.innerText);
        const afternoon = await page.$eval(`#MainContent_gvOpdList > tbody > tr:nth-child(${dayIndex}) > td:nth-child(3) > span`, el => el.innerText);

        if(!morning.match("(預掛額滿)")){
            data.push({ date, timeSlot:"上午" })
        }
        if(!afternoon.match("(預掛額滿)")){
            data.push({ date, timeSlot:"下午" })
        }

    }


    await browser.close();
    return data;
}

module.exports = getData;

