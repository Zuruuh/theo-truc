FROM node:24-alpine

WORKDIR /srv

COPY package.json package-lock.json ./

RUN npm i

COPY . .

CMD [ "node", "index.js" ]
