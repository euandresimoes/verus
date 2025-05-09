import simpleGit from "simple-git";
import inquirer from "inquirer";
import { chalkGrey, chalkPurple, chalkWhite } from "../utils/consoleColors.js";

class CommitService {
    constructor() {
        this.git = simpleGit();
    }

    async create(res, filesList) {
        const commitMessage = `${res.emoji} ${res.type}(${res.path}): ${res.message}`;
        console.log(`${chalkGrey("  ├─")}${chalkPurple("◆")} ${res.emoji} ${chalkWhite(res.type)}(${chalkWhite(res.path)}): ${chalkWhite(res.message)}`);

        console.log(`${chalkGrey("  │")}`);

        const prompt = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmCommit",
                message: `${chalkGrey("└─")}${chalkPurple("◆")}  Confirm this commit?`,
                choices: [
                    {
                        name: `Yes`,
                        value: "yes"
                    },
                    {
                        name: `No`,
                        value: "no"
                    }
                ],
                theme: {
                    prefix: ' ',
                    indexMode: 'hidden',
                    style: {
                        answer: chalkGrey,
                        highlight: chalkWhite,
                    }
                }
            }
        ]);

        if (!prompt.confirmCommit) {
            process.exit(1);
        }

        this.git.add(filesList).commit(commitMessage);
    }
}

const commitService = new CommitService();
export { commitService };