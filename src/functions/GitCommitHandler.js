import simpleGit from "simple-git";
import Spinnies from "spinnies";
import { createFilePrompt } from "../utils/filePrompt.js";
import { chalkGrey, chalkPurple, chalkYellow, chalkWhite, chalkRed } from "../utils/consoleColors.js";
import { createMessagePrompt } from "../utils/messagePrompt.js";

// Spinner Animation
const spinner = {
    interval: 160,
    frames: [chalkPurple("  ◐"), chalkPurple("  ◓"), chalkPurple("  ◑"), chalkPurple("  ◒")]
}
const spinnies = new Spinnies({ spinner });

class GitCommitHandler {
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
                return;
            }

            // Create file prompt
            const selectedFiles = await createFilePrompt(filesList);
            
            console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("◆")}${selectedFiles.length > 1 ? chalkWhite(" Summarize what you did in these files:") : chalkWhite(" Summarize what you did in this file:")}`)
            
            // Create message prompt
            const message = await createMessagePrompt();

            console.log(chalkGrey("  │"));
            // Spinner animation itialization
            spinnies.add('spinner-1', { text: ' ' });
            // 5s sleep for better spinner animation
            await new Promise(resolve => setTimeout(resolve, 5000));
            spinnies.stopAll();

            console.log(`${chalkGrey("  └─")}`)

        } catch (err) {
            if (err.message.includes("not a git repository")) {
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkYellow("⚠  Warning: ")}${chalkWhite("Git repository not found. Initialize one with 'git init'.")}\n`);
                return;
            } else if (err.message.includes("User force closed")) {
                console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖  Error: ")}${chalkWhite("Operation cancelled by user.")}\n`);
                return;
            }  else {
                console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖  Error: ")}${chalkWhite(err.message)}\n`);
                return;
            }
        }
    }
}

const gitCommitHandler = new GitCommitHandler();
export { gitCommitHandler };