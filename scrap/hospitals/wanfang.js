const puppeteer = require('puppeteer');

const baseUrl = "https://www.wanfang.gov.tw/p3_register_e3.aspx?deptcode=B055&depttype=A&deptdesc=%E8%87%AA%E8%B2%BBCOVID-19%E7%96%AB%E8%8B%97%E9%96%80%E8%A8%BA&depttype2=A";

const getData = async () => {

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
    await page.waitForSelector('#ContentPlaceHolder1_DataPager1 > input:nth-last-child(-n+2)')

    for (let i = 0; i<2; i++){
        await page.waitForSelector('#ContentPlaceHolder1_DataPager1 > input:nth-last-child(-n+2)')
        const nextPage = await page.$(`#ContentPlaceHolder1_DataPager1 > input:nth-last-child(-n+2)`);

        await page.waitForSelector('#ContentPlaceHolder1_gv_Result > tbody');
        const rowsEl = await page.$$('#ContentPlaceHolder1_gv_Result > tbody > tr');
        for (let dayIndex = 1; dayIndex <= rowsEl.length; dayIndex++) {
            const dateEl = await page.$(`#ContentPlaceHolder1_gv_Result > tbody > tr:nth-child(${dayIndex}) > td > div:nth-child(1) > span`);
            let date = await dateEl.evaluate(el => el.innerText);
            const morningEl = await page.$(`#ContentPlaceHolder1_gv_Result > tbody > tr:nth-child(${dayIndex}) > td > div:nth-child(2) > span`);
            const afternoonEl = await page.$(`#ContentPlaceHolder1_gv_Result > tbody > tr:nth-child(${dayIndex}) > td > div:nth-child(3) > span`);

            const morning = await morningEl.evaluate(el => el.innerText);
            const morningList = morning.split(/\n/);
            if(morningList[3].localeCompare("(年齡限制18-130)(額滿，已無預約號及現場號)") !== 0 && morningList[3] !== null && morningList[3].match(/^ *$/) === null){
                data.push({ date, timeSlot:"早上" })
            }
            const afternoon = await afternoonEl.evaluate(el => el.innerText);
            const afternoonList = afternoon.split(/\n/);

            if(afternoonList[3].localeCompare("(年齡限制18-130)(額滿，已無預約號及現場號)") !== 0 && afternoonList[3] !== null && afternoonList[3].match(/^ *$/) === null){
                data.push({ date, timeSlot:"早上" })
            }
        }
        await nextPage.click();

    }

    await browser.close();
    return data;
}

module.exports = getData;

