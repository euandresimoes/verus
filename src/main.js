#!/usr/bin/env node

import { Command } from "commander";
import { simpleCommit } from "./utils/simpleCommit.js";

const program = new Command();

program
    .name("Verus")
    .description("Verus CLI")
    .version("vrs_1.0.0")
    .option("-c, --commit", "Make a git commit.")
    .option("-p, --pretty", "Style the commit with emojis")
    .action((options) => {
        if (options.commit && options.pretty) {
            simpleCommit();
            return;
        }

        if (options.commit) {
            console.log("\n- Commit comum. \n");
            return;
        }

        if (!options.commit) {
            console.log("\n- Acho que você está esquecendo do -c ou --commit... \n");
            return;
        }
    });

program.parse(process.argv);