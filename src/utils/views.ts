import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";

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
  .setTimestamp()
  .setFooter({
    text: "Bir şeyler ters gitti.",
    iconURL: "https://cdn.discordapp.com/emojis/1281242968937730048.png",
  });