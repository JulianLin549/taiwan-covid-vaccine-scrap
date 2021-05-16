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
    await Promise.all([
        keelung(),
        // macKay(),
        // ntu(),
        // wanfang(),
        // taipeiMed(),
        // taipeiTzuchi(),
        // loudongStMary(),
        // taoyuan(),
        // ntuHsinchu(),
        // tunyuan(),
        // miaoli(),
        // taichung(),
        // puliChris(),
        // nantou(),
        // ntuYunlin(),
        // stMartin(),
        // chiayiChangGung(),
        // chengKung(),
        // xiaoKang(),
        // ksUnited(),
        // pintungChris(),
        // hualienTzuchi(),
        // taitung(),
        // kinmen()
    ])
}

go();
