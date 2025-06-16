import { promises as fs, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const LOG_DIR = '/app/logs';
const MAX_FILE_SIZE_KB = parseInt(
  process.env.LOG_MAX_FILE_SIZE_KB || '5120',
  10,
);

if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR);
}

const baseFilename = join(LOG_DIR, 'library');

async function rotateLogFile() {
  const files = await fs.readdir(LOG_DIR);
  const logFiles = files
    .filter((f) => f.startsWith('library') && f.endsWith('.log'))
    .sort();

  if (logFiles.length > 0) {
    const latestFile = logFiles[logFiles.length - 1];
    const filePath = join(LOG_DIR, latestFile);
    const stats = await fs.stat(filePath);

    if (stats.size < MAX_FILE_SIZE_KB) {
      return filePath;
    }
  }

  const newFileName = `${baseFilename}-${Date.now()}.log`;
  return newFileName;
}

export async function writeLogToFile(message: string, isError = false) {
  try {
    const fileName = await rotateLogFile();

    const fullMessage = `${new Date().toISOString()} ${message}\n`;

    await fs.appendFile(fileName, fullMessage);

    if (isError) {
      const errorFileName = join(LOG_DIR, 'errors.log');
      await fs.appendFile(errorFileName, fullMessage);
    }
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}
