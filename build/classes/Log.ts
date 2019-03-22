export enum LogLevel {
  None,
  Error,
  Warn,
  Info,
  Debug,
  Debug2
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
    this.log(LogLevel.Error, '[' + this.error.caller + '] ERROR: ' + msg, parameters)
  }

  warn(msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Warn, '[' + this.caller + '] WARN: ' + msg, parameters)
  }

  info(msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Info, '[' + this.caller + '] INFO: ' + msg, parameters)
  }

  debug(msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Debug, '[' + this.caller + '] DEBUG: ' + msg, parameters)
  }

  debug2(msg: string, ...parameters: any[]): void {
    this.log(LogLevel.Debug2, '[' + this.caller + '] DEBUG2: ' + msg, parameters)
  }

  private log(logLevel: LogLevel, msg: string, parameters: any[]): void {
    if (logLevel <= this.logLevel) {
      Logger.log.apply(Logger, [msg, ...parameters]);
      //console.log.apply(console, [msg, ...parameters]);
    }
  }

}

