import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import inquirer from 'inquirer';
import { chalkGrey, chalkPurple, chalkYellow, chalkWhite, chalkRed, chalkGreen } from '../../utils/console-colors.js';

class CommitService {
    constructor() {
        // Encontrar a raiz do repositório git
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

        // Se não encontrar .git, usar o diretório atual
        return process.cwd();
    }

    async create(res, filesList) {
        const commitMessage = `${res.emoji} ${res.type}${res.path ? `(${res.path})` : ''}: ${res.message}`;
        console.log(`${chalkGrey("  ├─")}${chalkPurple("◆")} ${res.emoji} ${chalkWhite(res.type)}${res.path ? `(${chalkWhite(res.path)})` : ""}: ${chalkWhite(res.message)}`);
        console.log(`${chalkGrey("  │")}`);

        // Confirmação do usuário
        const prompt = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmCommit",
                message: `${chalkGrey("├─")}${chalkPurple("◆")} Confirm this commit?`,
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

            // Filtrar apenas arquivos que existem - CORREÇÃO PRINCIPAL AQUI
            const existingFiles = filesList.filter(file => {
                // Usar this.gitRoot como base, não process.cwd()
                const filePath = path.resolve(this.gitRoot, file);
                const exists = fs.existsSync(filePath);
                if (!exists) {
                    console.log(`${chalkGrey("  ├───")}${chalkYellow("⚠")} ${chalkWhite("File not found, skipping:")}${chalkGrey(` ${file}`)}`);
                    console.log(`${chalkGrey("  ├───")}${chalkGrey("ℹ")} ${chalkWhite("Looked at:")}${chalkGrey(` ${filePath}`)}`);
                }
                return exists;
            });

            if (existingFiles.length === 0) {
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkYellow("⚠")} ${chalkWhite("No valid files found to add.")}`);
                console.log(`${chalkGrey("  ├─")}${chalkGrey("ℹ")} ${chalkWhite("Git root:")}${chalkGrey(` ${this.gitRoot}`)}`);
                console.log(`${chalkGrey("  ├─")}${chalkGrey("ℹ")} ${chalkWhite("Current dir:")}${chalkGrey(` ${process.cwd()}`)}`);
                console.log(`${chalkGrey("  └─")}${chalkGrey("ℹ")} ${chalkWhite("Files attempted:")}${chalkGrey(` ${filesList.join(', ')}`)}`);
                process.exit(0);
            }

            // Adicionar todos os arquivos existentes de uma vez
            try {
                await this.git.add(existingFiles);
                console.log(`${chalkGrey("  ├───")}${chalkGrey("◆")} ${chalkWhite("Added all valid files")}`);
            } catch (addError) {
                // Se falhar, tentar um por um
                console.log(`${chalkGrey("  ├───")}${chalkYellow("⚠")} ${chalkWhite("Bulk add failed, trying individually...")}`);

                for (const file of existingFiles) {
                    try {
                        await this.git.add(file);
                        console.log(`${chalkGrey("  ├───")}${chalkGrey("◆")} ${chalkWhite("Added:")}${chalkGrey(` ${file}`)}`);
                    } catch (individualError) {
                        console.error(`${chalkGrey("  │  ├─")}${chalkRed("✖")} ${chalkWhite(`Failed to add: ${file}`)}`);
                        console.error(`${chalkGrey("  │  └─")}${chalkRed("Error: ")} ${chalkWhite(individualError.message)}`);
                    }
                }
            }

            // Verificar se pelo menos um arquivo foi adicionado
            const newStatus = await this.git.status();
            if (newStatus.staged.length === 0) {
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkYellow("⚠")} ${chalkWhite("No files were staged. Nothing to commit.")}`);
                process.exit(0);
            }

            // Agora realizamos o commit
            console.log(`${chalkGrey("  │")}\n${chalkGrey("  ├─")}${chalkPurple("◆")} ${chalkWhite("Creating commit...")}`);
            try {
                const commitResult = await this.git.commit(commitMessage);
                console.log(`${chalkGrey("  │")}\n${chalkGrey("  └─")}${chalkPurple("◆")} ${chalkWhite("Commit created successfully!")}`);

                // Exibir mais detalhes sobre o commit
                if (commitResult && commitResult.commit) {
                    console.log(`${chalkGrey("        └─")}${chalkYellow("◆")} ${chalkWhite(`Commit hash: ${commitResult.commit}`)}\n`);
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