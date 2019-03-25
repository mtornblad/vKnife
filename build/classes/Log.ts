export enum LogLevel {
  None,
  Error,
  Warn,
  Info,
  Debug,
  Debug2,
  Debug3
}

export class Log {

  private logLevel: LogLevel;
  private caller: string;

  constructor(caller: string) {
    this.caller = caller.toUpperCase();
    switch (this.caller) {
      case "SCOUTNET":
        this.logLevel = LogLevel.Debug;
        break;
      default:
        this.logLevel = LogLevel.Debug2;
    }
  }

  error(msg: string, ...parameters: any[]): void {
    if (this.logLevel >= LogLevel.Error) {
      console.error.apply(console, ['[' + this.caller + '] ' + msg, ...parameters]);
      Logger.log.apply(Logger, ['[' + this.caller + '] ERROR: ' + msg, ...parameters]);
    }
  }

  warn(msg: string, ...parameters: any[]): void {
    if (this.logLevel >= LogLevel.Warn) {
      console.warn.apply(console, ['[' + this.caller + '] ' + msg, ...parameters]);
      Logger.log.apply(Logger, ['[' + this.caller + '] WARN: ' + msg, ...parameters]);
    }
  }

  info(msg: string, ...parameters: any[]): void {
    if (this.logLevel >= LogLevel.Info) {
      console.info.apply(console, ['[' + this.caller + '] ' + msg, ...parameters]);
      Logger.log.apply(Logger, ['[' + this.caller + '] INFO: ' + msg, ...parameters]);
    }
  }

  debug(msg: string, ...parameters: any[]): void {
    if (this.logLevel >= LogLevel.Debug) {
      console.log.apply(console, ['[' + this.caller + '] ' + msg, ...parameters]);
      Logger.log.apply(Logger, ['[' + this.caller + '] DEBUG: ' + msg, ...parameters]);
    }
  }

  debug2(msg: string, ...parameters: any[]): void {
    if (this.logLevel >= LogLevel.Debug) {
      console.log.apply(console, ['[' + this.caller + '] ' + msg, ...parameters]);
      Logger.log.apply(Logger, ['[' + this.caller + '] DEBUG: ' + msg, ...parameters]);
    }
  }

  debug3(msg: string, ...parameters: any[]): void {
    if (this.logLevel >= LogLevel.Debug3) {
      console.log.apply(console, ['[' + this.caller + '] ' + msg, ...parameters]);
      Logger.log.apply(Logger, ['[' + this.caller + '] DEBUG: ' + msg, ...parameters]);
    }
  }



}

