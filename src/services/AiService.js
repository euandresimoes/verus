import OpenAI from "openai";
import simpleGit from "simple-git";
import { configService } from "./ConfigService.js";
import { chalkGrey, chalkRed, chalkWhite } from "../utils/consoleColors.js";

const commitTypes = {
    feat: "✨",
    fix: "🐛",
    docs: "📚",
    style: "💎",
    refactor: "🔨",
    perf: "🚀",
    build: "📦",
    chore: "🔧",
    init: "🎉",
    meta: "📇",
    test: "🚨",
    sec: "🔒",
    "deps-up": "⬆️",
    "deps-down": "⬇️",
    deploy: "🚀",
    docker: "🐳",
    ci: "👷",
};

class AiService {
    constructor() {
        this.git = simpleGit();
    }

    async send(filesList, summary) {
        const apiKey = configService.getApiKey();

        if (!apiKey) {
            console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖  Error: ")}${chalkWhite("Invalid or missing API key. Use 'verus -k <your-api-key>' to set it up.")}\n`);
            process.exit(1);
        }

        const openai = new OpenAI({
            apiKey: apiKey
        });

        // Instructions
        const systemMessage = `
You are a CLI assistant that generates concise git commit messages. Respond with a valid JSON object, no explanations.

Rules:
- Output format:
  {
    "emoji": "🔧",
    "type": "fix",
    "path": "(auth-service-java)",
    "message": "Fix login validation"
  }
- Infer the path as the name of the root folder of the project or service (e.g., "auth-service-java").
- Use the folder name only, no full paths.
- Choose the commit type carefully based on the change context. Do NOT default to "feat" unless it is actually a new feature.
- Commit types include: feat, fix, docs, style, refactor, perf, test, chore, ci.
- Keep the message under 10 words.
- Use only the emoji, type, path, and message — no extra text.

Types and emojis:
${JSON.stringify(commitTypes)}

Reply in English.
`;

        // Files and summary
        const userMessage = `Files changed: ${filesList.join("\n")} Summary: ${summary}`;

        // API Request
        const res = await openai.chat.completions.create({
            model: "gpt-4.1-nano",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage }
            ],
            temperature: 0.3
        });

        const parsed = JSON.parse(res.choices[0].message.content);
        return parsed;
    }
}

const aiService = new AiService();
export { aiService };