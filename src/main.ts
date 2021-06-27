import * as dotenv from "dotenv";
import {CwaPassGenerator} from "./CwaPassGenerator";

let testMode = false;

if (process.argv.includes("--test")) {
    testMode = true;
    console.log("TEST MODE")
}

dotenv.config();
const express = require('express')
const app = express();
const port = 3000;

let generator = new CwaPassGenerator();
if (!testMode) {
    generator.setup();
}

app.use(express.json({limit: '50mb'}));

app.get('/', (req, res) => {
    res.send('READY');
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
        res.sendStatus(500);
    }

})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    if (testMode) {
        setTimeout(() => {
            process.exit(0);
        }, 2000);
    }

})

function makeToken(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}