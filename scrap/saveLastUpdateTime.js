const Hospital = require("../model/hospital");

const saveLastUpdateTime = async () => {
    let init = await Hospital.findOne({name: "default"});
    if (init) {
        init.updatedAt = Date.now();
        await init.save();
    } else {
        let newHospital = new Hospital();
        newHospital.name = "default";
        newHospital.updatedAt = Date.now();
        await newHospital.save();
    }
}

module.exports = saveLastUpdateTime;