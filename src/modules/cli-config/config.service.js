import fs from 'fs';
import path from 'path';
import os from 'os';
import { chalkGrey, chalkPurple, chalkRed, chalkWhite } from '../../utils/console-colors.js';

export const configPath = os.platform() === 'win32'
    ? path.join(os.homedir(), 'AppData', 'Roaming', 'verus', 'config.json')
    : path.join(os.homedir(), '.config', 'verus', 'config.json');

class ConfigService {
    async setApiKey(apiKey) {
        const dir = path.dirname(configPath);
        // Checks if the directory exists, otherwise creates it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Create or update file with API Key
        const config = { apiKey };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        if (fs.existsSync(configPath)) {
            console.log(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkPurple('◆')} ${chalkWhite(`API Key saved! Use 'verus' to start using the CLI.`)}\n`);
        } else {
            console.error('Failed to create the file.');
            console.error(`${chalkGrey('  │')}\n${chalkGrey('  └─')}${chalkRed('✖  Error: ')}${chalkWhite('Failed to save the API Key.')}\n`);
        }
    }

    getApiKey() {
        try {
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                return config.apiKey;
            }
        } catch (error) {
            return null;
        }
        return null;
    }
}

const configService = new ConfigService();
export { configService };