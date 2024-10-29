## Step 1: Project Setup

### Initialize Project: Start by creating a new Node.js project:

```bash
mkdir weather-api
cd weather-api
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

## Step 2: Configure Prisma

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

## Step 3: Set Up Environment Variables

In your .env file, add the following values:

```plaintext
DATABASE_URL="postgresql://username:password@localhost:5432/weatherdb"
WEATHER_API_KEY="your_openweathermap_api_key"
```

Replace username, password, and weatherdb with your PostgreSQL credentials.
WEATHER_API_KEY is the API key for the weather API (such as OpenWeatherMap).

## Step 4: Create the Express Server

### Create an src folder for the TypeScript code, then create the main server file, src/index.ts:

src/index.ts
