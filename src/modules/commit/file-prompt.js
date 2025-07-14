import chalk from 'chalk';
import inquirer from 'inquirer';
import { chalkBgPurple, chalkGrey, chalkPurple, chalkRed, chalkWhite, chalkYellow } from '../../utils/console-colors.js';
import { verifyConnection } from '../../utils/connection-verifier.js';

export async function createFilePrompt(filesList) {
    const connectionStatus = await verifyConnection();
    const verusVersion = `📦 ${chalkWhite('1.0.12')}`;

    console.log(`\n${chalkPurple('  ◆')} ${chalkBgPurple(` Welcome to Verus 👋 `)} ${chalkGrey('│')} ${connectionStatus} ${chalkGrey('│')} ${verusVersion}`);

    // Prompt user with a checkbox to select files to commit
    const answer = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'selectedFiles',
            message: `${chalkGrey(' │')}\n  ${chalkPurple('◆')} Choose the files you want to commit:\n${chalkGrey('  │')}${chalkGrey('  └─')}${chalkPurple('▷')}${' ↑ ↓ to move, ␣ to select.'}\n${chalkGrey('  │')}`,
            prefix: '',
            choices: filesList.map(file => ({
                name: file.name,
                value: file.value
            })),
            theme: {
                icon: {
                    checked: `${chalkGrey(' ├─')}${chalkPurple('◆ ')}`,
                    unchecked: `${chalkGrey(' ├─')}${chalkPurple('◇ ')}`,
                    cursor: ' '
                },
                prefix: '',
                style: {
                    highlight: chalk.whiteBright,
                    disabledChoice: true,
                    answer: chalkPurple,
                    renderSelectedChoices: (choices) => {
                        const lines = choices.map(c => `  ${chalkGrey('├─')}${chalkPurple('◆')} ${chalkGrey(c.name || c.value)}`);
                        return choices <= 0 ? '' : `\n${lines.join('\n')}`;
                    }
                },
                helpMode: 'never',
            },
            instructions: false,
        }
    ]);

    if (answer.selectedFiles == 0) {
        throw new Error('No files selected..');
    }

    return answer.selectedFiles;
}