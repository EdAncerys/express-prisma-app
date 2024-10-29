// src/index.ts
import express, { Request } from 'express';
import axios from 'axios';
import { Joke as JokeType } from '../types/Joke';
import { PrismaClient } from '@prisma/client';

export const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

type Params = {
  type: string;
};

// Endpoint to fetch and save a joke
app.get('/joke/:type', async (req: Request<Params>, res: any) => {
  const jokeType = req.params.type;

  try {
    const response = await axios.get<JokeType>(
      `https://v2.jokeapi.dev/joke/${jokeType}`
    );
    console.log('RESPONSE ', response?.statusText);

    if (response.data.error) {
      return res.status(404).json({ message: 'No joke found.' });
    }

    const jokeText =
      response.data.type === 'twopart'
        ? `${response.data.setup} - ${response.data.delivery}`
        : response.data.joke;

    // Save the joke to the database
    const savedJoke = await prisma.joke.create({
      data: {
        category: response.data.category,
        joke: jokeText,
        safe: response.data.safe,
      },
    });

    res.json({
      id: savedJoke.id,
      category: savedJoke.category,
      joke: savedJoke.joke,
      safe: savedJoke.safe,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occurred while fetching or saving the joke.',
    });
  }
});

// Endpoint to get all jokes from the database
app.get('/jokes', async (req, res) => {
  try {
    const jokes = await prisma.joke.findMany();
    console.log('JOKES ', jokes);

    res.json(jokes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching jokes.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
