import * as dns from 'dns';
import { chalkGreen, chalkRed, chalkWhite } from './console-colors.js';

export async function verifyConnection() {
    return new Promise((resolve) => {
        dns.lookup('google.com', (err) => {
            if (err && err.code === 'ENOTFOUND') {
                resolve(`${chalkRed('●')} ${chalkWhite('No connection')}`);
                return;
            }

            resolve(`${chalkGreen('●')} ${chalkWhite('Connected')}`);
        })
    })
}