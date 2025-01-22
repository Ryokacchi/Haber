import { Routes } from "discord.js";
import { Event } from "../classes/event.js";
import { rest } from "../modules/client.js";
import { getSlashBuilders } from "../modules/commands.js";
import { botLog } from "../modules/variables.js";

export default new Event({
  categoryName: "ready",
  async execute(client) {
    const clientId = client.user.id;
    await rest.put(Routes.applicationCommands(clientId), { body: getSlashBuilders() });

    botLog.success("Bot başarıyla Discord'a giriş yaptı.");
  }
});