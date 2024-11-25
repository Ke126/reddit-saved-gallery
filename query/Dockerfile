# syntax=docker/dockerfile:1

# build on native build platform
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci --production
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/
EXPOSE 4001
USER node
ENV NODE_ENV=production
CMD ["node", "dist"]