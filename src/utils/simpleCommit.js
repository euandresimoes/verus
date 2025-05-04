import simpleGit from "simple-git";
import inquirer from "inquirer";
import chalk from "chalk";

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
                    disabledChoice: true
                },
                helpMode: 'never'
            },
            instructions: false
        }
    ])
        .catch(err => {
            // Handle prompt errors
            console.log(err.message);
            console.log("\n");
            return;
        })
}