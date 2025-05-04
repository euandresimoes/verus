#!/usr/bin/env node

import { Command } from "commander";
import { simpleCommit } from "./utils/simpleCommit.js";

const program = new Command();

program
    .name("Verus")
    .description("Verus CLI")
    .version("vrs_1.0.0")
    .action(() => {
        simpleCommit();
        return;
    });

program.parse(process.argv);