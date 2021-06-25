# ImpfpassToAppleWalletServer
Server to create Apple passes from the vaccination QR codes

This is a free time project at the moment in an very early stage


# Setup

1. place your Apple signing certificate in ./keys as mentioned [HERE](https://github.com/walletpass/pass-js/blob/master/README.md#get-your-certificates)
2. update the EU Register of medicinal products for human use as described [Here](https://github.com/Nils-witt/ImpfpassToAppleWalletServer/blob/main/README.md#update-the-eu-database)
3. set the .env or the docker-compose env´s


# Update the EU database

1. Download the XLSX file from the [offical website](https://ec.europa.eu/health/documents/community-register/html/reg_hum_act.htm?sort=n)
2. place it in db as 'input.xlsx'
3. run 'npm run db-update'

# Docker image

Image: TBA
Run the image:
```console
$ docker run -p 3000:3000 -v /yourKeys:/usr/src/app/keys nilswitt/vacxpass-server:latest
```
or you can use docker compose 

# iOS Client

[Repository](https://github.com/Nils-witt/VacxPass-iOS)