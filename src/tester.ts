import {DVWR} from "digital-vaccination-wallet-reader";

let qrcode = "HC1:.....";

(async () => {
    let dv = new DVWR();
    let cert: any = await dv.readQrCode(qrcode);
    console.log(cert);
    let data = await dv.readCertificate(cert.content);
    console.log(data);
})();
