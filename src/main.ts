import * as dotenv from "dotenv";
import {CwaPassGenerator} from "./CwaPassGenerator";

dotenv.config();
const express = require('express')
const app = express();
const port = 3000;

let generator = new CwaPassGenerator();
generator.loadTemplate();

app.use(express.json({limit: '50mb'}));
app.get('/', (req, res) => {
    res.send('READY')
})

app.post('/generate', async (req, res) => {
    let data = req.body;
    let id = Date.now().toString() + makeToken(100);
    try {
        await generator.generatePass(id, data.passToken);
        res.status(201);
        res.send(id);
    } catch (e) {
        res.sendStatus(500)
    }

})
app.use('/passes', express.static('./passes'))

app.get('/demoData', (req, res) => {

    let data = {
        passToken: "token",
        name: "Name",
        birthdate: "00.00.0000",
        validFrom: "00.00.0000",
        vaccineDate: "00.00.0000",
        vaccine: "J&J",
        manufacturer: "J&J",
        issuer: "RKI",
        country: "DE"
    }
    res.json(data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function makeToken(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}