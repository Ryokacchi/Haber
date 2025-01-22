import chalk from "chalk";

export enum LogLevel {
  ERROR = "error",
  SUCCESS = "success",
  INFO = "info",
  WARN = "warn",
}

export const LogLevelMap = {
  [LogLevel.ERROR]: chalk.hex("#ED4245"),
  [LogLevel.SUCCESS]: chalk.hex("#57F287"),
  [LogLevel.INFO]: chalk.hex("#5865F2"),
  [LogLevel.WARN]: chalk.hex("#FEE75C"),
};

export class Console {
  constructor(private readonly prefix: string) {
    this.prefix = prefix;
  }

  /**
   * Creates a formatted log message with a timestamp, prefix, and log level.
   * 
   * @private
   * @param {LogLevel} logLevel - The level of the log (e.g., "INFO", "ERROR", "SUCCESS").
   * @returns {string} - A string representing the formatted log message.
   * 
   * The message includes:
   * - A timestamp in the format `DD.MM.YYYY HH.MM.SS` with `•` as a separator.
   * - A prefix highlighted with a specific color (`#F7F6CF`).
   * - The log level, formatted and colored according to the `LogLevelMap`.
   * 
   * Example output:
   * `[21.01.2025 20.15.30 • 20.15.30] [PREFIX] [INFO]:`
   */
  private createLogMessage(logLevel: LogLevel): string {
    const timestamp = new Date()
      .toLocaleString("tr-TR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
      .replace(/\//g, ".")
      .replace(/:/g, ".");

    const coloredTimestamp = timestamp
      .split(" ")
      .map((text) => chalk.gray(text))
      .join(" ");
      
    const color = LogLevelMap[logLevel];

    return `${coloredTimestamp} ${chalk.white(this.prefix)} ${color(logLevel.toUpperCase())} ${chalk.gray("•")}`;
  }

  private log(level: LogLevel, messages: unknown[]): void {
    const logMessage = this.createLogMessage(level);
    console.log(logMessage, ...messages);
  }

  public error(...messages: unknown[]): void {
    this.log(LogLevel.ERROR, messages);
  }

  public success(...messages: unknown[]): void {
    this.log(LogLevel.SUCCESS, messages);
  }

  public info(...messages: unknown[]): void {
    this.log(LogLevel.INFO, messages);
  }

  public warn(...messages: unknown[]): void {
    this.log(LogLevel.WARN, messages);
  }

   /**
   * Throws an error with the provided messages.
   *
   * @param messages - The messages to include in the error.
   * @throws Throws an error with the concatenated messages.
   * @returns This function never returns as it always throws an error.
   */
   public throw(...messages: unknown[]): never {
    this.error();
    throw new Error(messages.join(" "));
  }
}