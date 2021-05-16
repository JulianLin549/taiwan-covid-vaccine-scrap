const keelung = require('./keelung');
const macKay = require('./macKay');
const ntu = require('./ntu');
const wanfang = require('./wanfang');
const taipeiMed = require('./taipetMed');
const taipeiTzuchi = require('./taipeiTzuchi');
const loudongStMary = require('./loudongStMary');
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
const xiaoKang = require('./xiaoKang')
const chengKung = require('./chengKung');
const ksUnited = require('./ksUnited')
const hualienTzuchi = require('./hualienTzuchi')
const pintungChris = require('./pintungChris')
const tunyuan = require('./tunyuan')

const go = async () => {
    await Promise.all([
        keelung(),
        macKay(),
        ntu(),
        wanfang(),
        taipeiMed(),
        taipeiTzuchi(),
        loudongStMary(),
        taoyuan(),
        ntuHsinchu(),
        tunyuan(),
        miaoli(),
        taichung(),
        puliChris(),
        nantou(),
        ntuYunlin(),
        stMartin(),
        chiayiChangGung(),
        chengKung(),
        xiaoKang(),
        ksUnited(),
        pintungChris(),
        hualienTzuchi(),
        taitung(),
        kinmen()
    ])
}

go();
