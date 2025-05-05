import simpleGit from "simple-git";
import inquirer from "inquirer";
import chalk from "chalk";
import Spinnies from "spinnies";

// Initialize simpleGit to interact with the local Git repository
const git = simpleGit();

// AI Commit Method
export async function simpleCommit() {

    // Get current Git Status
    const status = await git.status();

    // Extract the list of modified files
    const filesList = status.modified;

    // Console color styles
    const chalkPurple = chalk.ansi256(57);
    const chalkGrey = chalk.ansi256(238);
    const chalkYellow = chalk.ansi256(184);

    // Spinner Animation
    const spinner = {
        interval: 80,
        frames: [chalkPurple("◐"), chalkPurple("◓"), chalkPurple("◑"), chalkPurple("◒")]
    }
    const spinnies = new Spinnies({ spinner });

    // Prompt user with a checkbox to select files to commit
    const answer = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedFiles',
            message: `${chalkPurple("◆")} Choose the files you want to commit:\n${chalkGrey("  ├─")} ${chalkYellow("★")}${" Tip: Use ↑ ↓ to move"}\n${chalkGrey("  │")}`,
            prefix: '',
            choices: filesList.map(file => ({
                name: file,
                value: file
            })),
            theme: {
                icon: {
                    checked: `${chalkGrey(" ├─")} ${chalkPurple("◆")}`,
                    unchecked: `${chalkGrey(" ├─")} ${chalkPurple("◇")}`,
                    cursor: " "
                },
                style: {
                    highlight: chalk.whiteBright,
                    disabledChoice: true,
                    answer: chalkPurple,
                    renderSelectedChoices: (choices) => {
                        const lines = choices.map(c => `  ${chalkGrey("├─")} ${chalkPurple("◆")} ${chalk.whiteBright(c.name || c.value)}`);
                        return `\n${lines.join("\n")}`;
                    }
                },
                helpMode: 'never',
            },
            instructions: false,
        }
    ]).catch(err => {
        // Handle prompt errors
        console.log(err.message);
        console.log("\n");
        return;
    });

    // UI Part
    console.log(chalkGrey("  │"));

    // Spinner animation itialization
    spinnies.add('spinner-1', { text: ' ' });
    
    // 5s sleep for better spinner animation
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 
    spinnies.succeed('spinner-1', { text: `${chalkGrey("└─")} ${chalkPurple('Commit successful!')}` });
}