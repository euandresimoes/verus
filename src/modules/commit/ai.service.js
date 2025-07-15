import OpenAI from 'openai';
import simpleGit from 'simple-git';
import { configService } from '../../modules/cli-config/config.service.js';
import { chalkGrey, chalkRed, chalkWhite } from '../../utils/console-colors.js';

const commitTypes = {
    feat: '✨',
    fix: '🐛',
    docs: '📚',
    style: '💎',
    refactor: '🔨',
    perf: '🚀',
    build: '📦',
    chore: '🔧',
    init: '🎉',
    test: '🧪',
    sec: '🔒',
    deploy: '🚀',
    docker: '🐳',
    ci: '👷',
};

class AiService {
    constructor() {
        this.git = simpleGit();
    }

    async send(filesList, summary) {
        const apiKey = configService.getApiKey();

        if (!apiKey) {
            console.error(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkRed('✖  Error: ')}${chalkWhite(`Invalid or missing API key. Use 'verus - k < your - api - key > ' to set it up.`)}\n`);
            process.exit(1);
        }

        const openai = new OpenAI({ apiKey });

        const systemMessage = `
You are a CLI assistant that generates concise git commit messages. Respond only with a valid JSON object, no explanations.

Rules:
- Output format:
{
  "emoji": "🔧",
  "type": "fix",
  "message": "Fix login validation"
}
- Keep the message under 10 words.
- Choose the commit type carefully based on the summary:
  - Use "feat" for new features or enhancements.
  - Use "fix" for bug fixes or corrections.
  - Use "docs" for documentation changes.
  - Use "style" for code style or formatting changes.
  - Use "refactor" for code restructuring without changing behavior.
  - Use "perf" for performance improvements.
  - Use "test" for adding or fixing tests.
  - Use "chore" for maintenance tasks.
  - Use "ci" for continuous integration/configuration changes.
  - Use "init" only for the very first commit.
- Do not default to "feat" or "fix"; choose the type that best fits the summary.
- Use only the emoji, type, and message fields — no extra text.
- If this is the first commit of the project, use:
{
  "emoji": "🎉",
  "type": "init",
  "message": "Initial commit"
}

Types and emojis:
${JSON.stringify(commitTypes)}

Reply in English.
`;


        const userMessage = `Files changed:\n${filesList.join('\n')}\nSummary: ${summary}`;

        const res = await openai.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.3
        });

        const parsed = JSON.parse(res.choices[0].message.content);
        return parsed;
    }
}

const aiService = new AiService();
export { aiService };
