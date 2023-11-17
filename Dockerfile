FROM node:18-alpine as build

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/dist .

COPY --from=build /app/package*.json .

RUN npm ci

CMD ["npm", "run", "prod"]
