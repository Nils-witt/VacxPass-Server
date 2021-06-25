FROM node:16.0-buster-slim
WORKDIR /usr/src/app
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
COPY ./src ./src
RUN npx tsc

FROM node:16.0-buster-slim
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --only=prod
COPY ./db ./db
COPY ./template ./template
COPY --from=0 /usr/src/app/build ./build

CMD [ "node", "build/main.js" ]