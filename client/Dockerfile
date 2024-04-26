FROM node:alpine

RUN npm install -g pm2

WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm install

COPY ./ ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "docker-start"]