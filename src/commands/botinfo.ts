import { ApplicationIntegrationType, InteractionContextType } from "discord.js";
import { Command } from "../classes/command.js";
import { BotInfoEmbed } from "../utils/views.js";

export default new Command({
  data: (builder) =>
    builder
  .setName("botinfo")
    .setDescription("Bot hakkında daha fazla bilgi edinmek için bu komutu kullanabilirsiniz.")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
  async execute(interaction) {
    await interaction.editReply({ embeds: [await BotInfoEmbed(interaction)] });
  }
});