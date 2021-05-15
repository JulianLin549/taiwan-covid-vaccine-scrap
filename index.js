const keelung = require('./keelung');
const macKay = require('./macKay');
const ntu = require('./ntu');
const wanfang = require('./wanfang');
const taipeiMed = require('./taipetMed');
const tzuchi = require('./tzuchi');
const stMaryLoudong = require('./stMaryLoudong');
const taoyuan = require('./taoyuan');
const miaoli = require('./miaoli');
const taichung = require('./taichung');
const nantou = require('./nantou');
const taitung = require('./taitung');
const kinmen = require('./kinmen');
const ntuHsinchu = require('./ntuHsinchu')
const puliChris = require('./puliChris')
const ntuYunlin = require('./ntuYunlin')
const stMartin = require('./stMartin')
const chiayiChangGung = require('./chiayiChangGung')
const chengKung = require('./chengKung')


const go = async () => {
    // const data = await keelung();
    //const data = await mackay();
    //const data = await ntu();
    //const data = await wanfang();
    // const data = await taipeiMed();
    const data = await chengKung();


    console.log("faata:", data);
}

go();
