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
git checkout part2
```

## Environment Variables

copy file `.env.example` and rename to `.env`

## Build and run the application

launch Docker Desktop

run `docker-compose up --build`

Starting all services in detached mode `docker-compose up -d`

Stop and remove containers and volumes `docker-compose down -v`

Vulnerabilities scanning `npm run scan`

## Installing NPM modules

```
npm install
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

Built image in DockerHub `eugeniyare/nestjs-home-library`

## API Endpoints

The service provides the following REST endpoints:

Users (/user)

- `GET /user` - Get all users

- `GET /user/:id` - Get single user by ID

- `POST /user` - Create new user

- `PUT /user/:id` - Update user's password

- `DELETE /user/:id` - Delete user

Tracks (/track)

- `GET /track` - Get all tracks

- `GET /track/:id` - Get single track by ID

- `POST /track` - Create new track

- `PUT /track/:id` - Update track info

- `DELETE /track/:id` - Delete track

Artists (/artist)

- `GET /artist` - Get all artists

- `GET /artist/:id` - Get single artist by ID

- `POST /artist` - Create new artist

- `PUT /artist/:id` - Update artist info

- `DELETE /artist/:id` - Delete artist

Albums (/album)

- `GET /album` - Get all albums

- `GET /album/:id` - Get single album by ID

- `POST /album` - Create new album

- `PUT /album/:id` - Update album info

- `DELETE /album/:id` - Delete album

Favorites (/favs)

- `GET /favs` - Get all favorites

- `POST /favs/track/:id` - Add track to favorites

- `DELETE /favs/track/:id` - Remove track from favorites

- `POST /favs/album/:id` - Add album to favorites

- `DELETE /favs/album/:id` - Remove album from favorites

- `POST /favs/artist/:id` - Add artist to favorites

- `DELETE /favs/artist/:id` - Remove artist from favorites

## Manual Testing with Postman

1. Import the OpenAPI specification from `doc/openapi.yml` into Postman

2. Test each endpoint with valid and invalid data to verify:

- Success cases (200, 201, 204 responses)

- Error cases (400, 403, 404, 422 responses)
