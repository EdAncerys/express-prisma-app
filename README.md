# Express API with Prisma and Jest Testing

This project is a simple Express API server that uses Prisma as an ORM for database interactions. The API includes a `/joke/:type` endpoint to fetch and save jokes of a specified type.

## Prerequisites

- **Node.js** (version 16 or higher)
- **PostgreSQL** or **SQLite** for Prisma
- **Jest** for testing

## Project Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

## Project Setup

### Initialize Project: Start by creating a new Node.js project:

```bash
mkdir express-app
cd express-app
npm init -y
```

### Install Dependencies: Install Express, Prisma, TypeScript, and other required packages:

```bash
npm install express prisma @prisma/client pg axios dotenv
npm install --save-dev typescript ts-node @types/express
```

### Initialize TypeScript: Initialize TypeScript with a tsconfig.json:

```bash
npx tsc --init
```

Then, configure tsconfig.json to target Node.js (like setting "module": "commonjs" and "strict": true).

### Initialize Prisma:

```bash
npx prisma init
```

This creates a prisma folder with a schema.prisma file and a .env file. The .env file stores sensitive information like database credentials and API keys.

## Configure Prisma

### Open the prisma/schema.prisma file and define the Weather model:

```prisma
datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

generator client {
provider = "prisma-client-js"
}

model Weather {
id Int @id @default(autoincrement())
location String
temperature Float
condition String
timestamp DateTime @default(now())
}

```

Explanation: This model defines a table Weather with columns id, location, temperature, condition, and timestamp. Each weather record is stored with information about the location, temperature, weather condition, and the timestamp when it was saved.

### Run the migration to create the database schema:

```bash
npx prisma migrate dev --name init
```

## Set Up Environment Variables

In your .env file, add the following values:

```plaintext
DATABASE_URL="postgresql://username:password@localhost:5432/weatherdb"
WEATHER_API_KEY="your_openweathermap_api_key"
```

Replace username, password, and weatherdb with your PostgreSQL credentials.
WEATHER_API_KEY is the API key for the weather API (such as OpenWeatherMap).

## Create the Express Server

### Create an src folder for the TypeScript code, then create the main server file, src/index.ts:

src/index.ts

Install dependencies:

````bash
npm install
Setup the environment variables:

Create a .env file in the root directory and add the following:

```plaintext
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>"
PORT=4000
````

Adjust the DATABASE_URL for your PostgreSQL setup or use SQLite for simpler testing.

Prisma Setup:

Initialize Prisma and create your database migrations:

```bash
npx prisma migrate dev --name init
```

Run the server:

```bash
npm start
```

The server will start at http://localhost:4000 by default.

## API Documentation

Fetch a Joke by Type
Endpoint: GET /joke/:type

Description: Fetches a joke of the specified type from an external API and saves it to the database.

Parameters:

type: The category of the joke to be fetched (e.g., Programming, Dark, etc.).
Response:

Returns a JSON object containing the joke's category, content, and safe flag.
Example
Request:

```bash
curl http://localhost:4000/joke/Programming
```

Response:

```json
{
  "id": 1,
  "category": "Programming",
  "joke": "Why do programmers prefer dark mode? Because light attracts bugs!",
  "safe": true
}
```

## Testing

This project uses Jest for testing. The tests are located in the **tests** directory.

Running Tests
Install Jest (if not already installed):

```bash
npm install --save-dev jest @types/jest ts-jest supertest
```

Run the tests:

```bash
npm test
```

Troubleshooting Port Conflicts:

If you encounter port conflicts while testing, ensure no other process is using the same port. You can adjust the port for testing by adding a .env.test file and specifying a different PORT.

Test Example
In the test file **tests**/app.test.ts, we use Jest and Supertest to test our API endpoint.

Example Test Code

```typescript
import request from 'supertest';
import app from '../src/index';

describe('GET /joke/:type', () => {
  it('should fetch a joke and save it to the database', async () => {
    const response = await request(app).get('/joke/Programming');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('category', 'Programming');
    expect(response.body).toHaveProperty('joke');
    expect(response.body).toHaveProperty('safe');
  });

  it('should return a 400 error if joke type is invalid', async () => {
    const response = await request(app).get('/joke/UnknownType');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid joke type');
  });
});
```

### This test:

Checks if the /joke/:type endpoint returns a joke with the correct properties.
Validates that an invalid joke type results in a 400 status with an appropriate message.
Technologies Used
Express.js - For building the API
Prisma - For ORM and database management
Jest - For unit testing
Supertest - For API endpoint testing
Troubleshooting
If you experience issues with the database or server:

Ensure PostgreSQL or SQLite is running.
Double-check your environment variables in .env.
Make sure Prisma migrations have been applied with npx prisma migrate dev.

## License

This project is licensed under the MIT License.
