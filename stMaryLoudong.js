const puppeteer = require('puppeteer');

const baseUrl = "https://netreg.smh.org.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=FK&Date=&Noon=";

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
    await page.waitForSelector('#ctl00_ContentPlaceHolder1_iframeRegTable');
    const frame = await  page.frames().find(frame => frame.name() === 'iframeRegTable');
    frame.waitForSelector('#SchTable1');

    const weeksEl = await frame.$$('#SchTableDiv > table');
    for (let weekIndex = 1; weekIndex <= weeksEl.length; weekIndex++) {

        for (let dayIndex = 2; dayIndex <= 7; dayIndex++) {
            const date = await frame.$eval(`#SchTableDiv > table:nth-child(${weekIndex}) > tbody > tr.trRegSchHead > td:nth-child(${dayIndex})`, el => el.innerText);
            const morningEl = await frame.$(`#SchTableDiv > table:nth-child(${weekIndex}) > tbody > tr.trRegSchDay > td:nth-child(${dayIndex}) > span:nth-of-type(2)`);
            const afternoonEl = await frame.$(`#SchTableDiv > table:nth-child(${weekIndex}) > tbody > tr.trRegSchMiddle > td:nth-child(${dayIndex}) > span:nth-of-type(2)`);
            const nightEl = await frame.$(`#SchTableDiv > table:nth-child(${weekIndex}) > tbody > tr.trRegSchNight > td:nth-child(${dayIndex}) > span:nth-of-type(2)`);

            if(morningEl !== null && !(await morningEl.evaluate(el => el.innerText)).match("額滿")){
                data.push({ date, timeSlot:"上午" })
            }
            if(afternoonEl !== null && !(await afternoonEl.evaluate(el => el.innerText)).match("額滿")){
                data.push({ date, timeSlot:"下午" })
            }
            if(nightEl !== null && !(await nightEl.evaluate(el => el.innerText)).match("額滿")){
                data.push({ date, timeSlot:"晚上" })
            }
        }
    }


    await browser.close();
    return data;
}

module.exports = getData;

