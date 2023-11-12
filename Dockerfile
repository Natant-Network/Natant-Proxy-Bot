FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "prod"]
