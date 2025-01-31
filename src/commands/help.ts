import { ApplicationIntegrationType, EmbedBuilder, InteractionContextType } from "discord.js";
import { Command } from "../classes/command.js";
import { getCommands } from "../modules/commands.js";

export default new Command({
  data: (builder) =>
    builder
      .setName("help")
      .setDescription("Eğer kafanız karıştıysa ya da ne yapacağınızı bilmiyorsanız, yardım alabilirsiniz.")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
  async execute(interaction) {
    const HelpView = new EmbedBuilder()
      .setColor("#5865f2")
      .setAuthor({
        name: `${interaction.user.displayName} (@${interaction.user.username})`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle("Yardım")
      .setDescription("Kullanılabilir tüm komutlar aşağıda listelenmiştir. Herhangi bir komutla ilgili sorun yaşarsanız bizimle iletişime geçebilirsiniz. [Daha fazla bilgi.](https://discord.gg/r3AdKRY9Ha)")
      .addFields({
        name: "Komutlar:",
        value: getCommands().map((command) => `\`/${command.build().name}\``).join(", "),
      })
      .setTimestamp()
      .setFooter({
        text: `©️ 2024 ${interaction.client.user.username}`,
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [HelpView] });
  }
});