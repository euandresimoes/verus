#!/usr/bin/env node

import { Command } from "commander";
import { gitCommitHandler } from "./functions/GitCommitHandler.js";

const program = new Command();

program
    .name("Verus")
    .description("Verus CLI")
    .version("vrs_1.0.0")
    .action(() => {
        gitCommitHandler.start();
    });
program.parse(process.argv);