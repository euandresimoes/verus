import * as fs from 'fs';
import { chalkWhite } from './console-colors.js';

export function getVerusVersion() {
    const json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return `📦 ${chalkWhite(json.version)}`;
}