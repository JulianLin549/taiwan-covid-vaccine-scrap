const Hospital = require("../model/hospital");

const saveToDb = async (name, data) => {
    let hospital = await Hospital.findOne({name: name});
    if (hospital) {
        hospital.data = data
        await hospital.save();
    } else {
        let newHospital = new Hospital();
        newHospital.name = name;
        newHospital.data = data;
        await newHospital.save();
    }
}

module.exports = saveToDb;