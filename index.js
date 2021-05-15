const keelung = require('./keelung');
const macKay = require('./macKay');
const ntu = require('./ntu');
const wanfang = require('./wanfang');
const taipeiMed = require('./taipetMed');
const tzuchi = require('./tzuchi');
const stMaryLoudong = require('./stMaryLoudong');

const go = async () => {
    // const data = await keelung();
    //const data = await mackay();
    //const data = await ntu();
    //const data = await wanfang();
    // const data = await taipeiMed();
    const data = await stMaryLoudong();


    console.log("faata:", data);
}

go();
