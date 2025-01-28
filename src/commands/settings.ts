import { ApplicationIntegrationType, InteractionContextType, PermissionsBitField } from "discord.js";
import { Command } from "../classes/command.js";
import { prisma } from "../functions/dbConnection.js";
import type { ServiceData } from "../interfaces/prisma.types.js";
import { getServicesByServer } from "../utils/rows.js";
import { SetupView } from "../utils/views.js";

export default new Command({
  data: (builder) =>
    builder
      .setName("settings")
      .setDescription("Oluşturulmuş haber akışlarınızı kolayca silebilir veya yönetebilirsiniz.")
      .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
      .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
      .setContexts(InteractionContextType.Guild),
  async execute(interaction) {
    const server = await prisma.servers.findUnique({ where: { server: interaction.guild!.id }, select: { services: true } });

    const services = (server?.services ?? []) as unknown as ServiceData[];

    await interaction.editReply({ embeds: [SetupView(interaction)], components: [getServicesByServer({ services })] });
  }
});