import type { InputJsonValue } from "@prisma/client/runtime/library";
import { ApplicationIntegrationType, InteractionContextType, PermissionsBitField, type ButtonInteraction, type ChannelSelectMenuInteraction, type MentionableSelectMenuInteraction, type RoleSelectMenuInteraction, type StringSelectMenuInteraction, type UserSelectMenuInteraction } from "discord.js";
import { Command } from "../classes/command.js";
import { prisma } from "../functions/dbConnection.js";
import type { ServiceData } from "../interfaces/prisma.types.js";
import { getServicesByServer } from "../utils/rows.js";
import { LoadingView, SetupView, SuccessEmbed, withoutAuthor } from "../utils/views.js";

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
    let services = (server?.services ?? []) as unknown as ServiceData[];

    const message = await interaction.editReply({ embeds: [SetupView(interaction)], components: [getServicesByServer({ services, disabled: services.length === 0 })] });

    /**
     * Filters interactions to ensure they match the original user's ID and message ID.
     * 
     * This function checks whether an interaction originates from the same user who initiated
     * the command and is tied to the same message. It is typically used as a filter for collectors.
     * 
     * @param {StringSelectMenuInteraction | UserSelectMenuInteraction | RoleSelectMenuInteraction | MentionableSelectMenuInteraction | ChannelSelectMenuInteraction | ButtonInteraction} i 
     *   The interaction to be checked. This can be one of several interaction types, such as:
     *   - StringSelectMenuInteraction
     *   - UserSelectMenuInteraction
     *   - RoleSelectMenuInteraction
     *   - MentionableSelectMenuInteraction
     *   - ChannelSelectMenuInteraction
     *   - ButtonInteraction
     * 
     * @returns {boolean} Returns `true` if the interaction is from the same user and matches the message ID, otherwise `false`.
     */
    const filter = (i: StringSelectMenuInteraction | UserSelectMenuInteraction | RoleSelectMenuInteraction | MentionableSelectMenuInteraction | ChannelSelectMenuInteraction | ButtonInteraction): boolean => i.user.id === interaction.user.id && message.id === i.message.id;
    const collector = message.createMessageComponentCollector({ filter, time: 60 * 1000 });

    collector.on("end", () => {
      void (async function() {
        await interaction.editReply({ content: ":x: **-**  Mesaj süreniz doldu.", components: [getServicesByServer({ services, disabled: true })] }).catch(() => undefined);
      });
    });

    collector.on("collect", (i) => {
      void (async function() {
        if (!i.isStringSelectMenu()) return;
        await i.update({ embeds: [SetupView(interaction), LoadingView(interaction)], components: [getServicesByServer({ services, disabled: true })] });

        const serviceId = i.values[0] as unknown as string;
        services = services.filter((service) => service.categoryId !== serviceId);
        
        await prisma.servers.update({
          where: { server: interaction.guild!.id },
          data: { services: [ ...services as unknown as  InputJsonValue[] ] }
        });
        await interaction.editReply({ embeds: [SetupView(interaction), withoutAuthor(SuccessEmbed(interaction).setDescription("Yapılan değişiklikler başarıyla kaydedildi ve veritabanına kaydedildi."))], components: [getServicesByServer({ services, disabled: services.length === 0 })] });
      })();
    });
  }
});