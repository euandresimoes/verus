import simpleGit from "simple-git";
import inquirer from "inquirer";
import { chalkGrey, chalkPurple, chalkWhite, chalkRed, chalkGreen } from "../utils/consoleColors.js";

class CommitService {
    constructor() {
        this.git = simpleGit({
            baseDir: process.cwd(),
            binary: 'git',
            maxConcurrentProcesses: 1,
            trimmed: false
        });
    }

    async create(res, filesList) {
        const commitMessage = `${res.emoji} ${res.type}(${res.path}): ${res.message}`;
        console.log(`${chalkGrey("  ├─")}${chalkPurple("◆")} ${res.emoji} ${chalkWhite(res.type)}(${chalkWhite(res.path)}): ${chalkWhite(res.message)}`);
        console.log(`${chalkGrey("  │")}`);
        
        // Confirmação do usuário
        const prompt = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmCommit",
                message: `${chalkGrey("├─")}${chalkPurple("◆")}  Confirm this commit?`,
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
            console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkPurple("ℹ")} ${chalkWhite("Commit cancelled by user.")}`);
            process.exit(0);
        }
        
        try {
            // Primeiro, verificamos o status atual
            const status = await this.git.status();
            console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("◆")} ${chalkWhite("Adding files to staging area...")}`);
            
            // Execute git add para cada arquivo individualmente para evitar problemas
            for (const file of filesList) {
                try {
                    await this.git.add(file);
                    console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("◆")} ${chalkGrey(`Added: ${file}`)}`);
                } catch (addError) {
                    console.error(`${chalkGrey("  │  ├─")}${chalkRed("✖")} ${chalkWhite(`Failed to add: ${file}`)}`);
                    console.error(`${chalkGrey("  │  └─")}${chalkRed("Error: ")} ${chalkWhite(addError.message)}`);
                    throw new Error(`Failed to add file: ${file}`);
                }
            }
            
            // Agora realizamos o commit
            console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("◆")} ${chalkWhite("Creating commit...")}`);
            try {
                const commitResult = await this.git.commit(commitMessage);
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkGreen("✓")} ${chalkWhite("Commit created successfully!")}`);
                
                // Exibir mais detalhes sobre o commit
                if (commitResult && commitResult.commit) {
                    console.log(`${chalkGrey("        └─")}${chalkPurple("ℹ")} ${chalkWhite(`Commit hash: ${commitResult.commit}`)}\n`);
                }
                
                return commitResult;
            } catch (commitError) {
                console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖")} ${chalkWhite("Failed to create commit")}`);
                console.error(`${chalkGrey("     └─")}${chalkRed("Error: ")} ${chalkWhite(commitError.message)}`);
                
                // Tentar commit sem a opção de emoji (que pode causar problemas em alguns ambientes)
                try {
                    console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("◆")} ${chalkWhite("Trying alternative commit format...")}`);
                    const plainMessage = `${res.type}(${res.path}): ${res.message}`;
                    const fallbackResult = await this.git.commit(plainMessage);
                    console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkGreen("✓")} ${chalkWhite("Commit created with plain format!")}`);
                    return fallbackResult;
                } catch (fallbackError) {
                    console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖")} ${chalkWhite("All commit attempts failed")}`);
                    throw new Error("Failed to create commit. Try manually via 'git commit'");
                }
            }
        } catch (error) {
            console.error(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkRed("✖")} ${chalkWhite(`Error during git operations: ${error.message}`)}`);
            
            // Exibir status do Git para diagnóstico
            try {
                const status = await this.git.status();
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("ℹ")} ${chalkWhite("Current Git status:")}`);
                console.log(`${chalkGrey("  │  ├─")}${chalkWhite(`Branch: ${status.current}`)}`);
                console.log(`${chalkGrey("  │  ├─")}${chalkWhite(`Staged files: ${status.staged.length}`)}`);
                console.log(`${chalkGrey("  │  └─")}${chalkWhite(`Modified files: ${status.modified.length}`)}`);
            } catch (statusError) {
                console.error(`${chalkGrey("  │  └─")}${chalkRed("✖")} ${chalkWhite("Could not get Git status")}`);
            }
            
            // Sugerir git commit manual
            console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkPurple("ℹ")} ${chalkWhite("Try running manually:")}`);
            console.log(`${chalkGrey("     └─")}${chalkWhite(`git add . && git commit -m "${commitMessage}"`)}`);
            
            process.exit(1);
        }
    }
}

const commitService = new CommitService();
export { commitService };