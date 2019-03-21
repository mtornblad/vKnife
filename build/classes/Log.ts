"use strict";

export enum LogLevel {
  None,
  Error,
  Warn,
  Info,
  Verbose
}

export class Log {
  logLevel: LogLevel;
  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  error(caller: string, msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Error, '[' + caller + '] ERROR: ' + msg, parameters)
  }

  warn(caller: string, msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Warn, '[' + caller + '] WARN: ' + msg, parameters)
  }

  info(caller: string, msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Info, '[' + caller + '] INFO: ' + msg, parameters)
  }

  verbose(caller: string, msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Verbose, '[' + caller + '] VERBOSE: ' + msg, parameters)
  }

  private log(logLevel: LogLevel, msg: string, parameters: any[]): void {
    if (logLevel <= this.logLevel) {
      Logger.log.apply(Logger, [msg, ...parameters]);
    }
  }

}

