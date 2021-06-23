import {Template} from "@walletpass/pass-js";
import * as fs from "fs";


export class CwaPassGenerator {
    template: Template;

    async loadTemplate(): Promise<void> {
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

    async generatePass(passId: string, barcodeId: string, name: string, validFrom: string, birthdate: string, vaccinationDate: string, vaccine: string, manufacturer: string, issuer: string, country: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let barcode: { message, format, messageEncoding } = {
                messageEncoding: "iso-8859-1",
                format: "PKBarcodeFormatQR",
                message: process.env.PASS_TOKEN
            };

            const pass = this.template.createPass({
                serialNumber: passId,
                description: "CWA CovPass"
            });

            pass.barcodes = [];
            pass.barcodes.push(barcode);

            let nameField = pass.primaryFields.get("name");
            let validField = pass.secondaryFields.get("valid_from");
            let name2Field = pass.backFields.get("name");
            let birthdateField = pass.backFields.get("birthdate");
            let vaccinationDateField = pass.backFields.get("vaccination_date");
            let vaccineField = pass.backFields.get("vaccine");
            let manufacturerField = pass.backFields.get("manufacturer");
            let issuerField = pass.backFields.get("issuer");
            let countryField = pass.backFields.get("country");

            nameField.value = name;
            name2Field.value = name;
            validField.value = validFrom;
            birthdateField.value = birthdate;
            vaccinationDateField.value = vaccinationDate;
            vaccineField.value = vaccine;
            manufacturerField.value = manufacturer;
            issuerField.value = issuer;
            countryField.value = country;

            const buf = await pass.asBuffer();
            fs.writeFileSync("./passes/" + passId + ".pkpass", buf);
            resolve();
        });
    }

}