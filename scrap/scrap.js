const puppeteer = require('puppeteer');
const keelung = require('./hospitals/keelung');
const macKay = require('./hospitals/macKay');
const ntu = require('./hospitals/ntu');
const wanfang = require('./hospitals/wanfang');
const taipeiMed = require('./hospitals/taipetMed');
const taipeiTzuchi = require('./hospitals/taipeiTzuchi');
const loudongStMary = require('./hospitals/loudongStMary');
const taoyuan = require('./hospitals/taoyuan');
const miaoli = require('./hospitals/miaoli');
const taichung = require('./hospitals/taichung');
const nantou = require('./hospitals/nantou');
const taitung = require('./hospitals/taitung');
const kinmen = require('./hospitals/kinmen');
const ntuHsinchu = require('./hospitals/ntuHsinchu')
const puliChris = require('./hospitals/puliChris')
const ntuYunlin = require('./hospitals/ntuYunlin')
const stMartin = require('./hospitals/stMartin')
const chiayiChangGung = require('./hospitals/chiayiChangGung')
const xiaoKang = require('./hospitals/xiaoKang')
const chengKung = require('./hospitals/chengKung');
const ksUnited = require('./hospitals/ksUnited')
const hualienTzuchi = require('./hospitals/hualienTzuchi')
const pintungChris = require('./hospitals/pintungChris')
const tunyuan = require('./hospitals/tunyuan')

const go = async () => {
    const width = 1375;
    const height = 800;
    const headless = {
        headless: true,
        args: [
            '--incognito',
            '--disable-features=site-per-process',
            '--no-sandbox',
            '--single-process',
            '--no-zygote',
            '--disable-setuid-sandbox'
        ],
        defaultViewport: null,
    };
    const normal = {
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
    }
//==========================================================================================
//check for run time set-up
//==========================================================================================
    const {PerformanceObserver, performance} = require('perf_hooks');
    const obs = new PerformanceObserver((items) => {
        console.log('PerformanceObserver A to B', (items.getEntries()[0].duration/1000).toFixed(4), '(s)');
        performance.clearMarks();
    });
    obs.observe({entryTypes: ['measure']});
    performance.mark('A');
//==========================================================================================
//check for run time start
//==========================================================================================



    const browser = await puppeteer.launch(headless);


    try {

        await Promise.all([
            //keelung(browser),
            // macKay(browser),
            // ntu(browser),
            // wanfang(browser),
            // taipeiMed(browser),
            // taipeiTzuchi(browser),
            //loudongStMary(browser),
            // taoyuan(browser),
            // ntuHsinchu(browser),
            // tunyuan(browser),
            miaoli(browser),
            //taichung(browser),
            // puliChris(browser),
            nantou(browser),
            // ntuYunlin(browser),
            // stMartin(browser),
            // chiayiChangGung(browser),
            // chengKung(browser),
            // xiaoKang(browser),
            // ksUnited(browser),
            // pintungChris(browser),
            // hualienTzuchi(browser),
            //taitung(browser),
            //kinmen(browser)
        ])
        await browser.close();

        //==========================================================================================
        //check for run time end
        //==========================================================================================
        console.log('\n')
        console.log('==========================================================================================')
        console.log("||                  Finish scraping hospital vaccine vacancy                            ||")
        console.log("||                           Process Complete!                                          ||")
        console.log('=========================================================================================')
        performance.mark('B');
        performance.measure('A to B', 'A', 'B');
    } catch (e) {
        console.log(e);
        await browser.close();
    }

}

module.exports = go;
