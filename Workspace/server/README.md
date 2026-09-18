# AI Travel Manager Web App - Server

## 1. Description

This is a Node.js Express backend created with TypeScript for the AI Travel Manager Web App. It handles the RESTful API for managing travel products, integrates with OpenAI for AI features, and connects to a PostgreSQL database using Prisma ORM.

## 2. Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [Docker](https://www.docker.com/) (optional, for local PostgreSQL setup)

## 3. Installation

Navigate to the `server` directory and install the dependencies:

```bash
cd Workspace/server
npm install
```

Set up your environment variables by copying the example file:

```bash
cp .env.example .env
```

*(Make sure to fill in your `OPENAI_API_KEY` to enable AI features).*

### Running with Docker

You can run both the API server and the PostgreSQL database together using Docker Compose. Make sure you have Docker installed.

To build and start both the server and database containers in the background, run:

```bash
docker-compose up -d
```

Since the database is empty on the first run, push your Prisma schema to create the tables:

```bash
npx prisma db push
```

To stop both the server and the database, run:

```bash
docker-compose down
```

### Local Development (Without Docker for Server)

If you prefer to run the API server locally while using Docker only for the database:

1. Start only the database:
   ```bash
   docker-compose up db -d
   ```
2. Push your Prisma schema to create the tables:
   ```bash
   npx prisma db push
   ```
3. Start the API server:
   ```bash
   npm run dev
   ```

## 4. Available Scripts

In the project directory, you can run:

### `npm run dev`
Starts the development server with hot-reloading using `ts-node-dev`. The server will automatically restart when you make changes to the code in the `src` directory.

### `npm run build`
Compiles the TypeScript source code into plain JavaScript and outputs it to the `dist` folder.

### `npm start`
Starts the production server by executing the compiled JavaScript code from the `dist` directory. You must run `npm run build` before using this command.

### `npm run lint`
Runs ESLint to find and report on problems in your TypeScript/JavaScript files.

### `npm run format`
Runs Prettier to automatically format all your source code files according to the project's `.prettierrc` configuration.

## 5. Source Code Structure

The `src` directory contains the core application logic, structured as follows:

- **`index.ts`**: The main entry point of the server that initializes the Express application, applies middlewares, and registers routes.
- **`config/`**: Contains configuration files, such as the OpenAI and DB setup.
- **`schema/`**: Contains Zod validation schemas used to validate the structure and types of incoming request payloads.
- **`middleware/`**: Contains custom Express middlewares, such as rate limiting, CORS configuration, and request data validation.
- **`routes/`**: Contains Express route definitions mapping endpoints to their respective controllers.
- **`controllers/`**: Contains the route handler functions that process incoming requests, integrate with AI services, and return responses.
- **`data/`**: Contains the database interaction functions wrapping Prisma ORM calls.

## 6. API Documentation

### Base API Path
`/travel-manager/v1/product`

### Endpoints

| Method   | Endpoint                | Description                                   |
| -------- | ----------------------- | --------------------------------------------- |
| `GET`    | `/health-check`         | Server health check. (Base URL path)          |
| `GET`    | `/list`                 | Fetch all travel products.                    |
| `GET`    | `/stats`                | Fetch travel product statistics.              |
| `POST`   | `/create`               | Create a new travel product.                  |
| `PUT`    | `/:productId/edit`      | Update an existing travel product's details.  |
| `DELETE` | `/delete`               | Delete travel products.                      |
| `POST`   | `/ai-search`            | AI-powered search for travel products.        |
| `POST`   | `/ai-generate`          | Generate travel product details via AI.       |
