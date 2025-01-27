import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";

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