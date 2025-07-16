import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import { chalkGrey, chalkPurple, chalkYellow, chalkWhite, chalkRed, chalkGreen } from '../../utils/console-colors.js';

class CommitService {
    constructor() {
        // Find the root of the git repository
        this.gitRoot = this.findGitRoot();

        this.git = simpleGit({
            baseDir: this.gitRoot,
            binary: 'git',
            maxConcurrentProcesses: 1,
            trimmed: false
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

        // If .git is not found, use the current directory
        return process.cwd();
    }

    async create(res, filesList) {
        const commitMessage = `${res.emoji} ${res.type}: ${res.message}`;
        console.log(`${chalkGrey('  ├─')}${chalkPurple('◆')} ${res.emoji} ${chalkWhite(res.type)}: ${chalkWhite(res.message)}`);
        console.log(`${chalkGrey('  │')}`);

        // User confirmation
        const prompt = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmCommit',
                message: `${chalkGrey('├─')}${chalkPurple('◆')} Confirm this commit?`,
                choices: [
                    {
                        name: `Yes`,
                        value: 'yes'
                    },
                    {
                        name: `No`,
                        value: 'no'
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
            console.log(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkPurple('ℹ')} ${chalkWhite('Commit cancelled by user.')}`);
            process.exit(0);
        }

        try {
            // First, we check the current status
            const status = await this.git.status();
            console.log(`${chalkGrey('  │')}\n${chalkGrey('  ├─')}${chalkPurple('◆')} ${chalkWhite('Adding files to staging area...')}`);

            // Separate existing and deleted files
            const existingFiles = [];
            const deletedFiles = [];

            for (const file of filesList) {
                const filePath = path.resolve(this.gitRoot, file);
                const exists = fs.existsSync(filePath);

                if (exists) {
                    existingFiles.push(file);
                } else {
                    // Check if the file is in the deleted status
                    const isDeleted = status.deleted.includes(file) ||
                        status.modified.includes(file) ||
                        status.not_added.includes(file);

                    if (isDeleted) {
                        deletedFiles.push(file);
                        console.log(`${chalkGrey('  ├───')}${chalkYellow('⚠')} ${chalkWhite('File deleted, will stage deletion:')}${chalkGrey(` ${file}`)}`);
                    } else {
                        console.log(`${chalkGrey('  ├───')}${chalkYellow('⚠')} ${chalkWhite('File not found and not in git status, skipping:')}${chalkGrey(` ${file}`)}`);
                    }
                }
            }

            // Add existing files
            if (existingFiles.length > 0) {
                try {
                    await this.git.add(existingFiles);
                    console.log(`${chalkGrey('  ├───')}${chalkGreen('✓')} ${chalkWhite('Added existing files:')}${chalkGrey(` ${existingFiles.join(', ')}`)}`);
                } catch (addError) {
                    console.log(`${chalkGrey('  ├───')}${chalkYellow('⚠')} ${chalkWhite('Bulk add failed, trying individually...')}`);

                    for (const file of existingFiles) {
                        try {
                            await this.git.add(file);
                            console.log(`${chalkGrey('  ├───')}${chalkGreen('✓')} ${chalkWhite('Added:')}${chalkGrey(` ${file}`)}`);
                        } catch (individualError) {
                            console.error(`${chalkGrey('  │  ├─')}${chalkRed('✖')} ${chalkWhite(`Failed to add: ${file}`)}`);
                            console.error(`${chalkGrey('  │  └─')}${chalkRed('Error: ')} ${chalkWhite(individualError.message)}`);
                        }
                    }
                }
            }

            // Process deleted files
            if (deletedFiles.length > 0) {
                console.log(`${chalkGrey('  ├───')}${chalkPurple('◆')} ${chalkWhite('Processing deleted files...')}`);

                for (const file of deletedFiles) {
                    try {
                        // Using git.add() for deleted files also works
                        // git add automatically detects that it is a delete
                        await this.git.add(file);
                        console.log(`${chalkGrey('  ├───')}${chalkGreen('✓')} ${chalkWhite('Staged deletion:')}${chalkGrey(` ${file}`)}`);
                    } catch (error) {
                        // If git add fails, try git rm
                        try {
                            await this.git.raw(['rm', '--cached', file]);
                            console.log(`${chalkGrey('  ├───')}${chalkGreen('✓')} ${chalkWhite('Removed from index:')}${chalkGrey(` ${file}`)}`);
                        } catch (rmError) {
                            console.error(`${chalkGrey('  │  ├─')}${chalkRed('✖')} ${chalkWhite(`Failed to stage deletion: ${file}`)}`);
                            console.error(`${chalkGrey('  │  └─')}${chalkRed('Error: ')} ${chalkWhite(rmError.message)}`);
                        }
                    }
                }
            }

            // Check if something has changed
            const newStatus = await this.git.status();
            const totalChanges = newStatus.staged.length + newStatus.deleted.length;

            if (totalChanges === 0) {
                console.log(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkYellow('⚠')} ${chalkWhite('No changes were staged. Nothing to commit.')}`);
                console.log(`${chalkGrey('     └─')}${chalkGrey('ℹ')} ${chalkWhite(`Try running 'git status' to see what files have changes.`)}`);
                process.exit(0);
            }

            // Now we commit
            console.log(`${chalkGrey('  │')}\n${chalkGrey('  ├─')}${chalkPurple('◆')} ${chalkWhite('Creating commit...')}`);
            try {
                const commitResult = await this.git.commit(commitMessage);
                console.log(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkGreen('✓')} ${chalkWhite('Commit created successfully!')}`);

                // Show more details about the commit
                if (commitResult && commitResult.commit) {
                    console.log(`${chalkGrey('        └─')}${chalkYellow('◆')} ${chalkWhite(`Commit hash: ${commitResult.commit}`)}\n`);
                }

                return commitResult;
            } catch (commitError) {
                console.error(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkRed('✖')} ${chalkWhite('Failed to create commit')}`);
                console.error(`${chalkGrey('     └─')}${chalkRed('Error: ')} ${chalkWhite(commitError.message)}`);

                // Try to commit without emoji
                try {
                    console.log(`${chalkGrey('  │')}\n${chalkGrey('  ├─')}${chalkPurple('◆')} ${chalkWhite('Trying alternative commit format...')}`);
                    const plainMessage = `${res.type}${res.path ? `(${res.path})` : ''}: ${res.message}`;
                    const fallbackResult = await this.git.commit(plainMessage);
                    console.log(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkGreen('✓')} ${chalkWhite('Commit created with plain format!')}`);
                    return fallbackResult;
                } catch (fallbackError) {
                    console.error(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkRed('✖')} ${chalkWhite('All commit attempts failed')}`);
                    throw new Error(`Failed to create commit. Try manually via 'git commit'`);
                }
            }
        } catch (error) {
            console.error(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkRed('✖')} ${chalkWhite(`Error during git operations: ${error.message}`)}`);

            // Display Git status for diagnostics
            try {
                const status = await this.git.status();
                console.log(`${chalkGrey('  │')}\n${chalkGrey('  ├─')}${chalkPurple('ℹ')} ${chalkWhite('Current Git status:')}`);
                console.log(`${chalkGrey('  │  ├─')}${chalkWhite(`Branch: ${status.current}`)}`);
                console.log(`${chalkGrey('  │  ├─')}${chalkWhite(`Staged files: ${status.staged.length}`)}`);
                console.log(`${chalkGrey('  │  ├─')}${chalkWhite(`Deleted files: ${status.deleted.length}`)}`);
                console.log(`${chalkGrey('  │  └─')}${chalkWhite(`Modified files: ${status.modified.length}`)}`);
            } catch (statusError) {
                console.error(`${chalkGrey('  │  └─')}${chalkRed('✖')} ${chalkWhite('Could not get Git status')}`);
            }

            // Suggest manual commands
            console.log(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkPurple('ℹ')} ${chalkWhite('Try running manually:')}`);
            console.log(`${chalkGrey('     ├─')}${chalkWhite(`git add -A`)} ${chalkGrey('(to add all changes including deletions)')}`);
            console.log(`${chalkGrey('     └─')}${chalkWhite(`git commit -m '${commitMessage}'`)}`);

            process.exit(1);
        }
    }
}

const commitService = new CommitService();
export { commitService };