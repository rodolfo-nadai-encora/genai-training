FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN apk --no-cache add --no-check-certificate ca-certificates && update-ca-certificates

RUN apk update && apk add --no-cache python3 py3-pip make gcc g++ musl-dev

RUN npm install -g node-gyp && npm install

COPY ./src ./src

EXPOSE 3000

CMD ["npm", "run", "start"]
