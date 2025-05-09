import simpleGit from "simple-git";
import Spinnies from "spinnies";
import { createFilePrompt } from "../utils/filePrompt.js";
import { chalkGrey, chalkPurple, chalkYellow, chalkWhite, chalkRed } from "../utils/consoleColors.js";
import { createMessagePrompt } from "../utils/messagePrompt.js";
import { aiService } from "./AiService.js";
import { commitService } from "./CommitService.js";

// Spinner Animation
const spinner = {
    interval: 160,
    frames: [chalkPurple("  ◐"), chalkPurple("  ◓"), chalkPurple("  ◑"), chalkPurple("  ◒")]
}
const spinnies = new Spinnies({ spinner });

class CommitHandlerService {
    constructor() {
        // Initialize simpleGit to interact with the local Git repository
        this.git = simpleGit();
    }

    async start() {
        let status;
        let filesList;

        try {
            status = await this.git.status();
            filesList = status.not_added;

            if (filesList.length === 0) {
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkYellow("⚠  Warning: ")}${chalkWhite("No staged files found for commit.")}\n`);
                process.exit(1);
            }

            // Create file prompt
            const selectedFiles = await createFilePrompt(filesList);
            
            console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("◆")}${selectedFiles.length > 1 ? chalkWhite(" Summarize what you did in these files:") : chalkWhite(" Summarize what you did in this file:")}`)
            
            // Create summary prompt
            const summary = await createMessagePrompt();

            console.log(chalkGrey("  │"));
            
            // API Request with data
            const res = await aiService.send(filesList, summary);

            // Create commit
            await commitService.create(res, filesList);

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