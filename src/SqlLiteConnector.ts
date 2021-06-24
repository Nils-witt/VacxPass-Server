import * as sqlite3 from 'sqlite3';


export class SqlLiteConnector {
    db: any;

    open(): Promise<void> {
        return new Promise(async (resolve, reject) => {

            this.db = new sqlite3.Database('./db/eu_meds.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err.message);
                } else {
                    resolve();
                    console.log('Connected to the database.');
                }
            });
        });
    }

    searchByRegId(id: string) {
        return new Promise(async (resolve, reject) => {

            let sql = `SELECT *
                       FROM meds
                       WHERE redId = ?`;
            this.db.all(sql, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    if (rows.length == 1) {
                        resolve(rows[0]);
                    } else {
                        reject("not found: " + rows.length);
                    }
                }
            });
        });
    }

    close() {
        this.db.close();
    }
}