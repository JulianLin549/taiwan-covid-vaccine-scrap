const puppeteer = require('puppeteer');

const url = "https://netreg.kln.mohw.gov.tw/OINetReg/OINetReg.Reg/Reg_RegTable.aspx?HID=F&Way=Dept&DivDr=0196&Date=&Noon"

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

    // const context = browser.defaultBrowserContext();
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
        week.click()
        await page.waitForTimeout(200);
        await frame.waitForSelector('#SchTable1');
        const daysEl = await frame.$$('#SchTable1 > tbody > tr.trRegSchHead > td');
        for (let dayIndex = 2; dayIndex <= daysEl.length; dayIndex++) {

            const dayTimeEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchHead > td:nth-of-type(${dayIndex})`);
            let date = await dayTimeEl.evaluate(el => el.innerHTML.split("<")[0]);//06/08星期二
            // let parts = date.split('/');
            // date = new Date(2021, parseInt(parts[0], 10)-1, parseInt(parts[1], 10));
            const timeSlotEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchDay > td:nth-child(1)`);
            const morningEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchDay > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);
            const afternoonEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchMiddle > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);
            const nightEl = await frame.$(`#SchTable1 > tbody > tr.trRegSchNight > td:nth-of-type(${dayIndex}) > span:nth-of-type(2)`);

            for await (let [i, timePeriodEl] of [morningEl, afternoonEl, nightEl].entries()){

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
    await browser.close();
    return data;
}

module.exports = getData;
