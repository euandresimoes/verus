import simpleGit from "simple-git";

const git = simpleGit();

export async function simpleCommit() {
    console.log("- Selecione os arquivos:\n");
    
    const diff = await git.diff();
    const diffLines = diff.split("\n");

    const diffList = []; 
    
    let oldLine = "";
    let newLine = "";

    diffLines.map(line => {
        if (line.startsWith("++") || line.startsWith("+++")) {
            
            
            diffList.push()
        }
    });
}