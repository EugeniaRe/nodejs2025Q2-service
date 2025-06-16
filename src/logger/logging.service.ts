import { Injectable, LoggerService } from '@nestjs/common';
import { writeLogToFile } from './rotatingWriter.util';

enum LogLevel {
  error = 0,
  warn = 1,
  info = 2,
  debug = 3,
}

@Injectable()
export class LoggingService implements LoggerService {
  private level: LogLevel =
    LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] ?? LogLevel.info;

  log(message: string) {
    this.write('info', message);
  }

  error(message: string, stack?: string) {
    this.write('error', `${message} | Stack: ${stack}`);
  }

  warn(message: string) {
    this.write('warn', message);
  }

  debug(message: string) {
    this.write('debug', message);
  }

  verbose(message: string) {
    this.write('verbose', message);
  }

  private async write(level: string, message: string) {
    const msg = `[${level.toUpperCase()}] ${message}`;
    if (this.shouldLog(level)) {
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        msg,
      );
      await writeLogToFile(msg, level === 'error');
    }
  }

  private shouldLog(logLevel: string): boolean {
    const requestedLevel =
      LogLevel[logLevel as keyof typeof LogLevel] ?? LogLevel.info;
    return requestedLevel <= this.level;
  }
}
