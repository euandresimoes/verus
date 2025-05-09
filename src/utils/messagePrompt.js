import inquirer from "inquirer";
import { chalkGrey, chalkPurple, chalkWhite, chalkYellow } from "./consoleColors.js";

export async function createMessagePrompt() {
    const prompt = await inquirer.prompt([
        {
            type: "input",
            name: "message",
            message: ` ${chalkGrey("│")}     ${chalkGrey("└─")}${chalkPurple("▷")}`,
            required: true,
            theme: {
                prefix: '',
                style: {
                    help: chalkYellow,
                    error: (text) => {
                        return `  ${chalkGrey("│")}\n  ${chalkGrey("└─")}${chalkYellow("⚠ ")}${chalkWhite("This field is required.")}`;
                    },
                    answer: chalkGrey
                }
            }
        }
    ]);

    return prompt.message;
}