"use strict";

enum LogLevel {
  None,
  Error,
  Warn,
  Info,
  Verbose
}

class Log {
  logLevel: LogLevel;
  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  error(msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Error, 'ERROR: ' + msg, parameters)
  }

  warn(msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Warn, 'WARN: ' + msg, parameters)
  }

  info(msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Info, 'INFO: ' + msg, parameters)
  }

  verbose(msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Verbose, 'VERBOSE:' + msg, parameters)
  }

  private log(logLevel: LogLevel, msg: string, parameters: any[]): void {
    if (logLevel <= this.logLevel) {
      Logger.log.apply(Logger, [msg, ...parameters]);
    }
  }

}

