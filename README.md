# RouteSync

RouteSync is a logistics and fleet management starter built with React, Vite, Express, and MongoDB.

## Getting started

1. Install Node.js 18+ and MongoDB, and make sure the MongoDB service is running.
2. Set `MONGO_URI` in `server/.env` to your running MongoDB instance. A local development config is included; set a private `JWT_SECRET` if you replace it.
3. Copy `client/.env.example` to `client/.env`.
4. From the project root, run `npm install` and then `npm run dev`. This starts the API and web app together. You can also start them separately with `npm run dev:server` and `npm run dev:client`.

The API listens on port 5100; the Vite app runs on port 5173 and proxies `/api` requests to it. The initial dashboard and list views use API data and show clear empty/error states.

## API

All fleet, shipment, and dashboard endpoints require a bearer token. Register or log in via `/api/auth/register` and `/api/auth/login`.

