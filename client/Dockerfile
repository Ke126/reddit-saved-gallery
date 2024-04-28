# syntax=docker/dockerfile:1

FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json .
COPY .env .
RUN npm install --production
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/
EXPOSE 3000
CMD ["npm", "run", "start"]