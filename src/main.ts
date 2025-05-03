import OpenAI from "openai";
import simpleGit, { SimpleGit } from "simple-git";
import dotenv from "dotenv";

dotenv.config();

const client: OpenAI = new OpenAI({
    apiKey: process.env.OPENAI_APIKEY as string
});

const git: SimpleGit = simpleGit();

(async () => {
    
})();