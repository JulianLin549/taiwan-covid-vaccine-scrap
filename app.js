const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    require('dotenv').config();
}
const express = require('express');
const scrap = require('./scrap/scrap');
const mongoose = require('mongoose');
const app = express();


(async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('MongoDB Connected...');


    } catch (error) {
        throw new Error('connection broke');
    }

})();

app.get('/scrap', (req, res) => {
    try {
        scrap();
    } catch(e) {
        console.log(e.message)
    }
    res.status(200).send("success");

});


app.get('/:else', (req, res) => {
    res.send("No such pass exist.");
})

//handle http server and socket io
const PORT = process.env.PORT;

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));
