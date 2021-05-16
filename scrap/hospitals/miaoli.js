const puppeteer = require('puppeteer');

const urls = ["https://reg2.mil.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=CO11&Date=&Noon=",
    "https://reg2.mil.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=CO41&Date=&Noon=",
    "https://reg2.mil.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=CO23&Date=&Noon="]


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


    for await (url of urls){
        await page.waitForTimeout(100);
        await page.goto(url);
        await page.waitForSelector('#ctl00_ContentPlaceHolder1_iframeRegTable');
        const frame = await  page.frames().find(frame => frame.name() === 'iframeRegTable');
        await frame.waitForSelector('#UpdatePanel1');
        const weeksEl = await frame.$$('#SchTableDiv > table > tbody');

        for (let weekIndex = 1; weekIndex <= weeksEl.length; weekIndex++) {
            for (let dayIndex = 2; dayIndex <= 7; dayIndex++) {
                const date = await frame.$eval(`#SchTableDiv > table:nth-of-type(${weekIndex}) > tbody > tr.trRegSchHead > td:nth-of-type(${dayIndex})`, el => el.innerText);
                const timeSlotEl = await frame.$(`#SchTableDiv > table:nth-of-type(${weekIndex}) > tbody > tr.trRegSchDay > td:nth-child(1)`);
                const morningEl = await frame.$(`#SchTableDiv > table:nth-of-type(${weekIndex}) > tbody > tr.trRegSchDay > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);
                const afternoonEl = await frame.$(`#SchTableDiv > table:nth-of-type(${weekIndex}) > tbody > tr.trRegSchMiddle > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);
                const nightEl = await frame.$(`#SchTableDiv > table:nth-of-type(${weekIndex}) > tbody > tr.trRegSchNight > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);

                for await (let timePeriodEl of [morningEl, afternoonEl, nightEl]){

                    if(timePeriodEl !== null) {
                        const innerText = await timePeriodEl.evaluate(el => el.innerText);
                        if(innerText.match(/\([0-9]+\)/gi)) {
                            const availability = innerText.match(/[0-9]+/gi)[0];
                            const timeSlot = await timeSlotEl.evaluate(el => el.innerText);
                            data.push({ date, timeSlot, availability })
                        }
                    }
                }
            }

        }
    }
    await browser.close();
    return data;
}

module.exports = getData;
