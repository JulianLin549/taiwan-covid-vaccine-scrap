const puppeteer = require('puppeteer');

const url = "https://tyghnetreg.tygh.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=0126&Date=&Noon="

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


    await page.goto(url);
    await page.waitForSelector('#ctl00_ContentPlaceHolder1_iframeRegTable');
    const frame = await  page.frames().find(frame => frame.name() === 'iframeRegTable');
    await frame.waitForSelector('#UpdatePanel1');
    const weeksEl = await frame.$$('#RdBtnLstWeek > input ');

    for (let weekIndex = 1; weekIndex <= weeksEl.length; weekIndex++) {
        await frame.waitForSelector('#UpdatePanel1');
        const week = await frame.$(`#RdBtnLstWeek > input:nth-of-type(${weekIndex})`);
        await week.click()
        await page.waitForTimeout(800);
        await frame.waitForSelector('#SchTable1');
        const daysEl = await frame.$$('#SchTable1 > tbody > tr.trRegSchHead > td');
        for (let dayIndex = 2; dayIndex <= daysEl.length; dayIndex++) {

            const dayTimeEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchHead > td:nth-of-type(${dayIndex})`);
            let date = await dayTimeEl.evaluate(el => el.innerText);//06/08星期二
            const timeSlotEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchDay > td:nth-child(1)`);
            const morningEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchDay > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);
            const afternoonEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchMiddle > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);
            const nightEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchNight > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);

            for await (let timePeriodEl of [morningEl, afternoonEl, nightEl]){

                if(timePeriodEl !== null) {
                    const innerText = await timePeriodEl.evaluate(el => el.innerText);
                    if(innerText.match(/\([0-9]+\)/gi)) {
                        const availability = innerText.match(/[0-9]+/gi);
                        const timeSlot = await timeSlotEl.evaluate(el => el.innerText);
                        data.push({ date, timeSlot, availability })
                    }
                }
            }
        }
    }
    await browser.close();
    return data;
}

module.exports = getData;
