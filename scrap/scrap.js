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
    // const browser = await puppeteer.launch({
    //     headless: true,
    //     args: [
    //         '--incognito',
    //         '--disable-features=site-per-process',
    //         '--no-sandbox',
    //         '--single-process',
    //         '--no-zygote',
    //         '--disable-setuid-sandbox'
    //     ],
    //     defaultViewport: null,
    // })
    try {

        await Promise.all([
            //keelung(browser),
            macKay(browser),
            // ntu(browser),
            // wanfang(browser),
            // taipeiMed(browser),
            // taipeiTzuchi(browser),
            //loudongStMary(browser),
            // taoyuan(browser),
            // ntuHsinchu(browser),
            // tunyuan(browser),
            // miaoli(browser),
            // taichung(browser),
            // puliChris(browser),
            // nantou(browser),
            // ntuYunlin(browser),
            // stMartin(browser),
            // chiayiChangGung(browser),
            // chengKung(browser),
            // xiaoKang(browser),
            // ksUnited(browser),
            // pintungChris(browser),
            // hualienTzuchi(browser),
            // taitung(browser),
            //kinmen(browser)
        ])
        await browser.close();
    } catch (e) {
        console.log(e);
        await browser.close();
    }

}

module.exports = go;
