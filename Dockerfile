FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm install --save-dev nodemon

CMD ["npx", "nodemon", "--ext", "ts,json", "--watch", "src", "--exec", "npm run start:dev"]
