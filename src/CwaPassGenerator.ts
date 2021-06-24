import {Template} from "@walletpass/pass-js";
import {DVWR} from "digital-vaccination-wallet-reader";
import {SqlLiteConnector} from "./SqlLiteConnector";


export class CwaPassGenerator {
    template: Template;
    db: SqlLiteConnector;

    constructor() {
        this.db = new SqlLiteConnector();
    }

    setup() {
        return new Promise(async (resolve, reject) => {
            await this.loadTemplate()
            await this.db.open();
        });
    }

    loadTemplate(): Promise<void> {
        return new Promise(async (resolve, reject) => {

            this.template = await Template.load(
                "./template"
            );

            await this.template.loadCertificate(
                "./keys/CWAPass.pem",
                process.env.CERT_PASS
            );
            this.template.passTypeIdentifier = process.env.PassTypeIdentifier;
            this.template.teamIdentifier = process.env.TeamIdentifier;
            resolve();
        });
    }

    generatePass(passId: string, barcodeId: string): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            let dv = new DVWR();
            let cert: any;
            let data;
            try {
                cert = await dv.readQrCode(barcodeId);
                data = await dv.readCertificate(cert.content);
            } catch (e) {
                reject(e);
                console.log("QR code failed");
                return;
            }

            if (data.certificates.length != 1) {
                reject("Cert error");
                return;
            }

            let barcode: { message, format, messageEncoding } = {
                messageEncoding: "iso-8859-1",
                format: "PKBarcodeFormatQR",
                message: barcodeId
            };

            const pass = this.template.createPass({
                serialNumber: passId,
                description: "CWA CovPass"
            });

            pass.barcodes = [];
            pass.barcodes.push(barcode);

            let nameField = pass.primaryFields.get("name");
            let validField = pass.secondaryFields.get("vaccination_date");
            let name2Field = pass.backFields.get("name");
            let birthdateField = pass.backFields.get("birthdate");
            let vaccinationDateField = pass.backFields.get("vaccination_date");
            let vaccineField = pass.backFields.get("vaccine");
            let manufacturerField = pass.backFields.get("manufacturer");
            let issuerField = pass.backFields.get("issuer");
            let countryField = pass.backFields.get("country");
            let uvciField = pass.backFields.get("uvci");

            let vCert = data.certificates[0];
            let med: any = await this.db.searchByRegId(vCert.VaccineMedicinalProduct);

            nameField.value = data.person.Forename + " " + data.person.Surname;
            name2Field.value = data.person.Forename + " " + data.person.Surname;
            validField.value = vCert.DateOfVaccination;
            birthdateField.value = data.person.Birthday;
            vaccinationDateField.value = vCert.DateOfVaccination;
            vaccineField.value = med.brand;
            manufacturerField.value = med.mHolder;
            issuerField.value = vCert.CertificateIssuer;
            countryField.value = vCert.CountryOfVaccination;
            uvciField.value = vCert.CertificateIdentifier;

            let buf = await pass.asBuffer();
            resolve(buf);
        });
    }

}