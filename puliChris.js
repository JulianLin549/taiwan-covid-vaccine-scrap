const puppeteer = require('puppeteer');


const baseUrl = "http://web2.pch.org.tw/Booking/Covid19Reg/Covid19Reg.aspx";

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

    await page.goto(baseUrl);
    await page.waitForSelector('#ddlSchd');
    const rowsEl = await page.$$(`#ddlSchd > option`);

    for await (rowEl of rowsEl) {
        const row = await rowEl.evaluate(el => el.innerText);
        if(!row.match(/\(額滿\)/gi)){
            const date = row.match(/\d+\/\d+\/\d+\([一二三四五六日]\)/gi);
            const timeSlot = row.match(/早上|下午/gi);
            data.push({ date, timeSlot })
        }
    }

    await browser.close();
    return data;
}

module.exports = getData;
