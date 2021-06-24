FROM node:16.0-buster-slim

# Create app directory
WORKDIR /usr/src/app
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
COPY ./src ./src
COPY ./db ./db
COPY ./template ./template
RUN npx tsc

CMD [ "node", "build/main.js" ]