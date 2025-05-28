import simpleGit from "simple-git";
import fs from 'fs';
import path from 'path';
import { createFilePrompt } from "../utils/filePrompt.js";
import { chalkGrey, chalkPurple, chalkYellow, chalkWhite, chalkRed } from "../utils/consoleColors.js";
import { createMessagePrompt } from "../utils/messagePrompt.js";
import { aiService } from "./AiService.js";
import { commitService } from "./CommitService.js";

class CommitHandlerService {
    constructor() {
        // Encontrar a raiz do repositório git
        this.gitRoot = this.findGitRoot();

        // Initialize simpleGit to interact with the local Git repository from root
        this.git = simpleGit({
            baseDir: this.gitRoot
        });
    }

    findGitRoot() {
        let currentDir = process.cwd();

        while (currentDir !== path.dirname(currentDir)) {
            if (fs.existsSync(path.join(currentDir, '.git'))) {
                return currentDir;
            }
            currentDir = path.dirname(currentDir);
        }

        // Se não encontrar .git, usar o diretório atual
        return process.cwd();
    }

    async start() {
        let status;
        let filesList;

        try {
            status = await this.git.status();
            filesList = [
                ...status.not_added.map(file => ({ name: `Not added: ${file}`, value: file })),
                ...status.modified.map(file => ({ name: `Modified: ${file}`, value: file })),
                ...status.deleted.map(file => ({ name: `Deleted: ${file}`, value: file })),
                ...status.renamed.map(file => ({ name: `Renamed: ${file.from} -> ${file.to}`, value: file.to })),
                ...status.created.map(file => ({ name: `Created: ${file}`, value: file })),
            ];

            if (filesList.length === 0) {
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkYellow("⚠  Warning: ")}${chalkWhite("No staged files found for commit.")}\n`);
                process.exit(1);
            }

            // Create file prompt
            const selectedFiles = await createFilePrompt(filesList);
            console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("◆")}${selectedFiles.length > 1 ? chalkWhite(" Summarize what you did in these files:") : chalkWhite(" Summarize what you did in this file:")}`);

            // Create summary prompt
            const summary = await createMessagePrompt();
            console.log(chalkGrey("  │"));

            // API Request with data
            const res = await aiService.send(selectedFiles, summary);

            // Create commit
            await commitService.create(res, selectedFiles);
        } catch (err) {
            if (err.message.includes("not a git repository")) {
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkYellow("⚠  Warning: ")}${chalkWhite("Git repository not found. Initialize one with 'git init'.")}\n`);
                process.exit(1);
            } else if (err.message.includes("User force closed")) {
                console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖  Error: ")}${chalkWhite("Operation cancelled by user.")}\n`);
                process.exit(1);
            } else if (err.message.includes("environment variable is missing or empty")) {
                console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖  Error: ")}${chalkWhite("Use 'verus -k <your-api-key>' to set it up.")}\n`);
                process.exit(1);
            } else if (err.message.includes("Incorrect API key provided")) {
                console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖  Error: ")}${chalkWhite("Incorrect API Key..")}\n`);
                process.exit(1);
            } else {
                console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖  Error: ")}${chalkWhite(err.message)}\n`);
                process.exit(1);
            }
        }
    }
}

const commitHandlerService = new CommitHandlerService();
export { commitHandlerService };