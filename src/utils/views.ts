import bytes from "bytes";
import { bold, EmbedBuilder, inlineCode, type ChatInputCommandInteraction } from "discord.js";
import moment from "moment";
import os from "os";
import { prisma } from "../functions/dbConnection.js";
import { getCommands } from "../modules/commands.js";
import { getEvents } from "../modules/events.js";

/**
 * Creates a new EmbedBuilder instance with a predefined color, timestamp, and footer.
 *
 * @param {ChatInputCommandInteraction} interaction - The interaction instance from which client details are extracted.
 * @returns {EmbedBuilder} A configured embed instance.
 */
export const Embed = (interaction: ChatInputCommandInteraction): EmbedBuilder => new EmbedBuilder()
  .setColor("#5865f2")
  .setTimestamp()
  .setFooter({
    text: `©️ 2024 ${interaction.client.user.username}`,
    iconURL: interaction.client.user.displayAvatarURL(),
  });

/**
 * Removes the author from the provided embed.
 *
 * @param {EmbedBuilder} embed - The EmbedBuilder instance from which to remove the author.
 * @returns {EmbedBuilder} - The modified EmbedBuilder instance with no author set.
 */
export const withoutAuthor = (embed: EmbedBuilder): EmbedBuilder => embed.setAuthor(null);

/**
 * Creates an embed to display the waiting status to the user during command processing
 * @param {ChatInputCommandInteraction} interaction - Discord interaction object
 * @returns {EmbedBuilder} Embed showing the waiting status
 */
export const LoadingView = (interaction: ChatInputCommandInteraction): EmbedBuilder => new EmbedBuilder()
  .setColor("#5865f2")
  .setAuthor({
    name: `Komut yürütülüyor — ${interaction.user.displayName} (@${interaction.user.username})`,
    iconURL: interaction.user.displayAvatarURL(),
  })
  .setDescription("Komutun cevap vermesi uzun sürebilir, anlayışınız için teşekkürler.")
  .setTimestamp()
  .setFooter({
    text: "Komut yürütülüyor, lütfen bekleyiniz.",
    iconURL: "https://cdn.discordapp.com/emojis/1216348767096143962.gif",
  });

/**
 * Creates an embed to display an error message to the user
 * @param {ChatInputCommandInteraction} interaction - Discord interaction object
 * @returns {EmbedBuilder} Embed showing the error status
 */
export const ErrorView = (interaction: ChatInputCommandInteraction): EmbedBuilder => new EmbedBuilder()
  .setColor("#ED4245")
  .setAuthor({
    name: `Hata — ${interaction.user.displayName} (@${interaction.user.username})`,
    iconURL: interaction.user.displayAvatarURL(),
  })
  .setTitle("Bir şeyler ters gitti.")
  .setTimestamp()
  .setFooter({
    text: "Bir şeyler ters gitti, lütfen daha sonra tekrar deneyiniz.",
    iconURL: "https://cdn.discordapp.com/emojis/1281242968937730048.png",
  });

/**
 * Creates and returns an embed indicating a successful operation.
 *
 * @param {ChatInputCommandInteraction} interaction - The interaction object, typically from a Discord command.
 * @returns {EmbedBuilder} - A configured EmbedBuilder instance with success message details.
 */
export const SuccessEmbed = (interaction: ChatInputCommandInteraction): EmbedBuilder => 
  new EmbedBuilder()
  .setColor("#57F287")
  .setAuthor({
    name: `Başarılı — ${interaction.user.displayName} (@${interaction.user.username})`,
    iconURL: interaction.user.displayAvatarURL(),
  })
  .setTitle("İşlem başarıyla tamamlandı.")
  .setTimestamp()
  .setFooter({
    text: "İşlem başarıyla tamamlandı.",
    iconURL: "https://cdn.discordapp.com/emojis/1258869126231752764.png",
  });


/**
 * Generates an embed for setting up a news channel with options for role tagging and category selection.
 *
 * @param {ChatInputCommandInteraction} interaction - The interaction object from the Discord command, used to retrieve user and client details.
 * @returns {EmbedBuilder} - A configured embed displaying the setup options for a news channel.
 *
 * @example
 * // Use this embed in a Discord bot response
 * const embed = SetupView(interaction);
 * await interaction.reply({ embeds: [embed] });
 */
export const SetupView = (interaction: ChatInputCommandInteraction): EmbedBuilder => 
  new EmbedBuilder()
    .setColor("#5865f2")
    .setAuthor({
      name: `${interaction.user.displayName} (@${interaction.user.username})`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTitle("Haber Kanalı Oluştur")
    .setDescription("Aşağıdaki menüler aracılığıyla, istediğin bir rolü etiketleyerek belirli bir kategoriye ait son dakika haberini bir kanal üzerinden gönderebilirsin.")
    .setTimestamp()
    .setFooter({
      text: `©️ 2024 ${interaction.client.user.username}`,
      iconURL: interaction.client.user.displayAvatarURL(),
    });

export const BotInfoEmbed = async (interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> => {
    const guilds = ((await (interaction.client.shard?.fetchClientValues("guilds.cache.size") ?? [])) as unknown[] as number[]).reduce((acc, guildCount) => acc + guildCount, 0);
    const members = ((await interaction.client.shard?.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)) as unknown[] as number[]).reduce((acc, memberCount) => acc + memberCount, 0));
  
    const startNow = performance.now();
    await prisma.$runCommandRaw({ ping: 1 }).catch(() => null);
    const endNow = performance.now();
  
    return Embed(interaction)
      .setAuthor({
        name: `${interaction.user.displayName} (@${interaction.user.username})`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle("Bot Bilgi")
      .setDescription(`${interaction.client.user.username} verileri anlık olarak güncelleme gösterebilir ve tüm kullanıcı gerektiren veriler, kullanıcı kimliğini açığa çıkarmaz.`)
      .addFields({
        name: "• Genel Veriler:",
        value: [
          `${inlineCode("-")} Sunucu sayısı: ${inlineCode(Intl.NumberFormat().format(guilds))}`,
          `${inlineCode("-")} Kullanıcı sayısı: ${inlineCode(Intl.NumberFormat().format(members))}`,
        ].join("\n"),
        inline: true,
      })
      .addFields({
        name: "** **",
        value: [
          `${inlineCode("-")} Websocket: ${inlineCode(`${interaction.client.ws.ping}ms`)}`,
          `${inlineCode("-")} Veritabanı: ${inlineCode(`${~~(endNow - startNow)}ms`)}`,
        ].join("\n"),
        inline: true,
      })
      .addFields({
        name: "** **",
        value: [
          `${inlineCode("-")} Shard ID: ${inlineCode(`#${interaction.client.shard?.ids[0]}`)}`,
          `${inlineCode("-")} Toplam Shard: ${inlineCode(`${interaction.client.shard?.count}`)}`,
        ].join("\n"),
        inline: true,
      })
      .addFields({
        name: "• Sayısal veriler:",
        value: [
          `${inlineCode("-")} Komut sayısı: ${inlineCode(`${getCommands().length}`)}`,
          `${inlineCode("-")} Etkinlik sayısı: ${inlineCode(`${getEvents().length}`)}`,
        ].join("\n"),
        inline: true,
      })
      .addFields({
        name: "** **",
        value: [
          `${inlineCode("-")} Bellek kullanımı: ${inlineCode(`${bytes(process.memoryUsage().heapUsed)}`)}`,
        ].join("\n"),
        inline: true,
      })
      .addFields({
        name: "** **",
        value: "** **",
        inline: true,
      })
      .addFields({
        name: "• Tarihsel veriler:",
        value: [
          `${inlineCode("-")} Bot başlama süresi: ${bold(moment(Date.now() - interaction.client.uptime).locale("tr").fromNow())}`,
          `${inlineCode("-")} Sunucu kullanım süresi: ${bold(moment(Date.now() - (os.uptime() * 1000)).locale("tr").fromNow())}`,
        ].join("\n"),
      })
      .addFields({
        name: "Bir sorun mu var?",
        value: "Topluluk sunucumuza gelerek bu sorunu beraber çözebiliriz. [Daha fazla bilgi.](https://discord.gg/r3AdKRY9Ha)",
      });
  };

