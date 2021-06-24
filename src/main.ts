import * as dotenv from "dotenv";
import {CwaPassGenerator} from "./CwaPassGenerator";

dotenv.config();
const express = require('express')
const app = express();
const port = 3000;

let generator = new CwaPassGenerator();
generator.setup();

app.use(express.json({limit: '50mb'}));

app.get('/', (req, res) => {
    res.send('READY')
})

app.post('/generate', async (req, res) => {
    let data = req.body;
    let id = Date.now().toString() + makeToken(100);
    try {
        let buffer: Buffer = await generator.generatePass(id, data.passToken);


        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="pass.pkpass"`,
            'Content-Type': 'application/vnd.apple.pkpass',
        });
        res.end(buffer);
    } catch (e) {
        res.sendStatus(500)
    }

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