const mongoose = require("mongoose");
const hospitalSchema = mongoose.Schema({
    name: String,
    data: [{
        date: String,
        timeSlot: String,
        availability: String
    }],
    updatedAt: { type: Date, default: Date.now() },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital