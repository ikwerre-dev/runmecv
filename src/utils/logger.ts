import fs from 'fs';
import path from 'path';

const LOGS_DIR = path.join(process.cwd(), 'public', 'logs');

if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

export function logToFile(key: string, content: string): void {
    try {
        // fror testing sha
        // const folders = fs.readdirSync(LOGS_DIR)
        //     .filter(file => fs.statSync(path.join(LOGS_DIR, file)).isDirectory())
        //     .map(folder => parseInt(folder))
        //     .filter(num => !isNaN(num))
        //     .sort((a, b) => b - a);

        // const nextNumber = folders.length > 0 ? folders[0] + 1 : 1;
        // const folderPath = path.join(LOGS_DIR, nextNumber.toString());

        // fs.mkdirSync(folderPath, { recursive: true });

        // const filePath = path.join(folderPath, `${key}.txt`);
        // fs.writeFileSync(filePath, content);
        // console.log('Log written to file:', key);
        console.log('logged', key);
    } catch (error) {
        console.error('Error writing log file:', error);
    }
}