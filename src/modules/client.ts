import { Client, IntentsBitField, PresenceUpdateStatus, REST } from "discord.js";
import { config } from "../functions/configLoader.js";
import { relaodCommands } from "./commands.js";
import { reloadEvents } from "./events.js";

export const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
  presence: { status: PresenceUpdateStatus.Idle },
  failIfNotExists: true,
});

export const rest = new REST({ version: "10" }).setToken(config.bot.token);

export async function start() {
  await Promise.all([reloadEvents(), relaodCommands()]);
  await client.login(config.bot.token);
}