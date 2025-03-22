import { ShardingManager, type ShardingManagerOptions } from "discord.js";
import { config } from "./functions/configLoader.js";
import { tryAndCatch } from "./functions/general.js";
import { fileify } from "./functions/strings.js";
import { botLog, shardLog } from "./modules/variables.js";

const options: ShardingManagerOptions = {
  totalShards: 3,
  respawn: true,
  token: config.bot.token,
  execArgv: ["--import", "bun"],
};
const manager = new ShardingManager(fileify("bot.ts"), { ...options });

await manager
  .on("shardCreate", (shard) => {
    shardLog.info(`Shard #${String(shard.id)} has spawned.`);

    shard
      .on("disconnect", () => {
        shardLog.warn(`Shard #${String(shard.id)} has disconnected.`);
      })
      .on("reconnecting", () => {
        shardLog.warn(`Shard #${String(shard.id)} has reconnected.`);
      });
  })
  .spawn()
  .then(() => {
    botLog.success("The bot has successfully logged into Discord.");
  })
  .catch(tryAndCatch);