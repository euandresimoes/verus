#!/usr/bin/env node

// Supress deprecation warnings
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' &&
        warning.message) {
        return;
    }
});

import { Command } from "commander";
import { configService } from "./modules/cli-config/config.service.js";
import { commitHandlerService } from "./modules/commit/commit-handler.service.js";

const program = new Command();

program
    .name("Verus")
    .description("Verus CLI")
    .version("vrs_1.0.0")
    .option("-k, --key <apikey>", "Set your OpenAI API key")
    .action((options) => {
        if (options.key) {
            configService.setApiKey(options.key);
        } else {
            commitHandlerService.start();
        }
    });

program.parse(process.argv);