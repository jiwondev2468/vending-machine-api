FROM ubuntu:22.04
FROM node:alpine

RUN mkdir -p /app

WORKDIR /app

COPY ./ /app

RUN npm install

RUN npm run build

RUN npm run prod

EXPOSE 50990 50990

ENV NODE_ENV=prod

CMD ["node", "dist/main.js"]