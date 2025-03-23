import { ActivityType, ChannelType, EmbedBuilder, PresenceUpdateStatus, Routes, type ActivitiesOptions } from "discord.js";
import he from "he";
import moment from "moment";
import { Event } from "../classes/event.js";
import { Subscription } from "../classes/subscription.js";
import { prisma } from "../functions/dbConnection.js";
import { roleMention, tryAndCatch } from "../functions/general.js";
import { getCategories } from "../functions/http.js";
import { trim } from "../functions/strings.js";
import type { ServiceData } from "../interfaces/prisma.types.js";
import { rest } from "../modules/client.js";
import { getSlashBuilders } from "../modules/commands.js";
moment.locale("tr");

const subscriptions = getCategories().map((category) => new Subscription(category.id));
const history = new Set<string>();

export default new Event({
  categoryName: "ready",
  async execute(client) {
    const clientId = client.user.id;
    await rest.put(Routes.applicationCommands(clientId), { body: getSlashBuilders() });
    
    const activity: ActivitiesOptions = { name: clientId, state: `/help`, type: ActivityType.Custom };
    client.user.setPresence({
      status: PresenceUpdateStatus.Online,
      activities: [activity]
    });
    
    await Promise.all(subscriptions.map(async (subscription) => {
      await subscription.checkAndSendLastArticle((article) => {
        if (history.has(article.id)) return;
        
        (async function() {
          const guilds = await prisma.servers.findMany() as unknown as { services: ServiceData[] }[];
          await Promise.all(guilds.map((guild) => {
            (async function() {
              const service = guild.services.find(service => service.categoryId === subscription.id);
              if (!service || service.categoryId !== subscription.id) return;

              const channel = await client.channels.fetch(service.channelId).catch(() => null);
              if (!channel || channel.type !== ChannelType.GuildText || !channel.isSendable()) return;

              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              const description = String(he.decode(trim(article.description, 4000)));
              const title = trim(article.title, 120).trim().replaceAll("SON DAKİKA!", "");
              const punctuation = title.endsWith(".") || title.endsWith("!") ? "" : (title.endsWith("yor") || title.endsWith("yorlar") ) ? "!" : ".";

              const ArticleEmbed = new EmbedBuilder()
                .setColor("#5865f2")
                .setTitle([title, punctuation].join(""))
                .setDescription(description)
                .setImage(article.media.thumbnail.url);
              const content = roleMention(service.roleId);

              channel.send({ content, embeds: [ArticleEmbed] }).catch(tryAndCatch);
            })().catch(tryAndCatch);
          }));
        })().catch(tryAndCatch);
        history.add(article.id);
      });
    }));
  }
}); 