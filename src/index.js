"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
// Endpoint to fetch and save a joke
app.get('/joke/:type', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jokeType = req.params.type;
    try {
        const response = yield axios_1.default.get(`https://v2.jokeapi.dev/joke/${jokeType}`);
        console.log('RESPONSE ', response);
        if (response.data.error) {
            return res.status(404).json({ message: 'No joke found.' });
        }
        const jokeText = response.data.type === 'twopart'
            ? `${response.data.setup} - ${response.data.delivery}`
            : response.data.joke;
        // Save the joke to the database
        const savedJoke = yield prisma.joke.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while fetching or saving the joke.',
        });
    }
}));
// Endpoint to get all jokes from the database
app.get('/jokes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jokes = yield prisma.joke.findMany();
        console.log('JOKES ', jokes);
        res.json(jokes);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: 'An error occurred while fetching jokes.' });
    }
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
