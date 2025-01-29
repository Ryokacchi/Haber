import { Cache } from "../classes/cache.js";
import { Console } from "../classes/console.js";
import type { ServiceData } from "../interfaces/prisma.types.js";

export const botLog = new Console("BOT");
export const commandLog = new Console("COMMANDS");
export const eventLog = new Console("EVENTS");
export const shardLog = new Console("SHARDS");

export const servicesMap = new Cache<ServiceData[]>();