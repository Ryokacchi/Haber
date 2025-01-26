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