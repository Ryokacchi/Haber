import process from "process";
import { tryAndCatch } from "./functions/general.js";
import { start } from "./modules/client.js";
import { botLog } from "./modules/variables.js";

process
  .on("exit", (code) => {
    botLog.error(`NodeJS process exited with code ${String(code)}`);
  })
  .on("unhandledRejection", (reason) => {
    botLog.error(reason);
  })
  .on("warning", (...args) => {
    botLog.warn(...args);
  })
  .on("uncaughtException", (error) => {
    botLog.error(error);
  });

await start().catch(tryAndCatch);