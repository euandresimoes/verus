#!/usr/bin/env node

// Supress deprecation warnings
process.removeAllListeners('warning');
process.on('warning', (warning) => {
    if (warning.name === 'DeprecationWarning' &&
        warning.message) {
        return;
    }
});

import { Command } from 'commander';
import { configService } from './modules/cli-config/config.service.js';
import { commitHandlerService } from './modules/commit/commit-handler.service.js';

const program = new Command();

program
    .name('Verus')
    .description('Verus, the CLI tool that integrates AI to automatically generate commit messages for your Git repositories.')
    .version('📦 1.0.22')
    .option('-k, --key <apikey>', 'Set your OpnAI API key')
    .action((options) => {
        if (options.key) {
            configService.setApiKey(options.key);
        } else {
            commitHandlerService.start();
        }
    });

program.parse(process.argv);