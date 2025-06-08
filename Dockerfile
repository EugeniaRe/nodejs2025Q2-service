
# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# CMD ["npm", "run", "start:dev"]




# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# # Установка nodemon для hot-reload
# RUN npm install -g nodemon

# CMD ["nodemon", "--watch", "src", "--exec", "npm", "run", "start:dev"]

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Установка nodemon как dev dependency (лучше чем глобальная)
RUN npm install --save-dev nodemon

# Явно указываем какие файлы нужно отслеживать
# CMD ["npx", "nodemon", "--watch", "src/**/*.ts", "--exec", "npm", "run", "start:dev", "--", "--preserveWatchOutput"]

# CMD ["npm", "run", "start:debug"]

CMD ["npx", "nodemon", "--ext", "ts,json", "--watch", "src", "--exec", "npm run start:dev"]
