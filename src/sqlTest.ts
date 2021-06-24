import * as sqlite3 from 'sqlite3';
import * as readXlsxFile from 'read-excel-file/node';

let db = new sqlite3.Database('./db/eu_meds.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
    }
});

let sql = `SELECT * FROM meds WHERE redId = ?`;

db.all(sql, ['EU/1/06/374'], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row);
    });
});