const puppeteer = require('puppeteer');


const baseUrl = "https://www.mmh.org.tw/register_single_doctor.php?depid=75&drcode=O75K";

const getData = async () => {
    // Viewport && Window size
    const width = 1375;
    const height = 800;
    const data = [];

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            `--window-size=${ width },${ height }`,
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
    await page.setViewport({ width: width, height: height });

    await page.goto(baseUrl);
    await page.waitForSelector('#tblSch');
    const dateColumnsEl = await page.$$(`#tblSch > tbody:nth-child(2) > tr`);

    for (let dateIndex = 1; dateIndex <= dateColumnsEl.length; dateIndex++) {
        const dateEl = await page.$(`#tblSch > tbody:nth-child(2) > tr:nth-child(${dateIndex}) > td:nth-child(1)`);
        const morningEl = await page.$$(`#tblSch > tbody:nth-child(2) > tr:nth-child(${dateIndex}) > td:nth-child(2) > a`);
        const afternoonEl = await page.$$(`#tblSch > tbody:nth-child(2) > tr:nth-child(${dateIndex}) > td:nth-child(3) > a`);

        if (dateEl !== null && (morningEl !== null || afternoonEl !== null) ) {
            let date = await dateEl.evaluate(el => el.innerHTML)
            // let date = new Date (await dateEl.evaluate(el => el.innerHTML.split("(")[0]));
            if (morningEl.length !== 0){
                data.push({ date, timeSlot:"早上" })
            }
            if (afternoonEl.length !== 0){
                data.push({ date, timeSlot:"下午" })
            }
        }

    }

    await browser.close();
    return data;
}

module.exports = getData;
