import * as sqlite3 from 'sqlite3';
import * as readXlsxFile from 'read-excel-file/node';

let db = new sqlite3.Database('./db/eu_meds.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});


db.run(`CREATE TABLE IF NOT EXISTS meds
        (
            redId   text,
            brand   text,
            mHolder text
        )`, (err) => {
    if (err) {
        console.log("!" + err.message);
        return;
    } else {
        console.log("table created");
    }
});

db.run(`DELETE
        FROM meds`, (err) => {
    if (err) {
        console.log("!" + err.message);
        return;
    } else {
        console.log("Table cleared");
    }
});

readXlsxFile('./db/input.xlsx').then((rows) => {
    for (let i = 3; i < rows.length; i++) {
        let row = rows[i];
        db.run(`INSERT INTO meds(redId, brand, mHolder)
                VALUES (?, ?, ?)`, [row[0], row[1], row[2]], (err) => {
            if (err) {
                return console.log("!" + err.message);
            } else {
                console.log("Data inserted");
            }
        });
    }
});