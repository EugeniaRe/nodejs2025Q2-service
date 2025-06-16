# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/EugeniaRe/nodejs2025Q2-service.git
```

## Switching the branch

```
git checkout feat/part3
```

## Environment Variables

copy file `.env.example` and rename to `.env`

## Build and run the application

launch Docker Desktop

run `npm run start:docker`

Starting all services in detached mode `docker-compose up -d`

Stop and remove containers and volumes `docker-compose down -v`

## Installing NPM modules

```
npm install
```

## Testing

After application running open new terminal and enter:

To run all test with authorization

```
npm run test:auth
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```
