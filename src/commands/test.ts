import type { InputJsonValue } from "@prisma/client/runtime/library";
import { type ActionRowBuilder, type ButtonBuilder, type ButtonInteraction, type ChannelSelectMenuInteraction, type MentionableSelectMenuInteraction, type RoleSelectMenuInteraction, type StringSelectMenuBuilder, type StringSelectMenuInteraction, type UserSelectMenuInteraction } from "discord.js";
import { nanoid } from "nanoid";
import { Command } from "../classes/command.js";
import { prisma } from "../functions/dbConnection.js";
import { getResponseByState } from "../functions/strings.js";
import type { ServiceData } from "../interfaces/prisma.types.js";
import { ids } from "../utils/constants.js";
import { getCategory, getChannel, getRole, getSave } from "../utils/rows.js";
import { ErrorView, SetupView, SuccessEmbed, withoutAuthor } from "../utils/views.js";

export default new Command({
  data: (builder) =>
    builder
      .setName("test")
      .setDescription("touicho touchio??"),
  async execute(interaction) {
    const server = await prisma.servers.findUnique({ where: { server: interaction.guild!.id }, select: { services: true } });

    const services = (server?.services ?? []) as unknown as ServiceData[];
    const service: ServiceData = { id: nanoid(), categoryId: ids.none, channelId: ids.none, roleId: ids.none };

    /**
     * Generates an array of interactive components for the setup view.
     * 
     * This function dynamically creates components based on the current configuration 
     * values (_config) and interaction context. The components include category, channel, 
     * role selectors, and a save button.
     *
     * @returns {(ActionRowBuilder<StringSelectMenuBuilder> | ActionRowBuilder<ButtonBuilder>)[]} An array of interactive Discord components.
     *   - The components include:
     *     1. A category selector.
     *     2. A channel selector with interaction context.
     *     3. A role selector with interaction context.
     *     4. A save button component.
     */
    const getComponents = (): (ActionRowBuilder<StringSelectMenuBuilder> | ActionRowBuilder<ButtonBuilder>)[] => [
      getCategory({ id: service.categoryId, array: [...services.flatMap((service) => service.categoryId)] }),
      getChannel({ id: service.channelId, interaction }),
      getRole({ id: service.roleId, interaction }),
      getSave(),
    ];


    /**
     * Updates the configuration object with the provided values based on the customId.
     * 
     * This function assigns the first value from the `values` array to the corresponding 
     * property in the `service` object, identified by the `customId`. If the `values` array 
     * is empty, it falls back to `ids.none`.
     * 
     * @param {string} customId - The key used to identify the property in the `service` object to update.
     * @param {string[]} values - An array of strings containing the new values to update. Only the first value is used.
     * 
     * @throws {TypeError} If `service[customId]` is not defined or if it cannot be accessed dynamically.
     * - This is indicated by the `@ts-expect-error` directive, which suppresses TypeScript errors for dynamic property access.
     * - Error Message: "Cannot access dynamic property on 'service' object."
     */
    const updateConfig = (customId: string, values: string[]) => {
      const firstVal = values[0] ?? ids.none;
      // @ts-expect-error Cannot access dynamic property on 'service' object.
      service[customId] = firstVal;
    };


    const message = await interaction.editReply({
      embeds: [SetupView(interaction)],
      components: getComponents(),
    });

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

    collector.on("collect", (i) => {
      void (async function() {
        if (i.isStringSelectMenu() && ["categoryId", "channelId", "roleId"].includes(i.customId)) {
          updateConfig(i.customId, i.values);
          await i.update({ embeds: [SetupView(interaction)], components: getComponents() });
        }
  
        if (i.isButton() && i.customId === "save") {
          // @ts-expect-error Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'ServiceData'
          const invalids = Object.keys(service).filter((key) => service[key] === ids.none) as (keyof ServiceData)[];
          const remaining = invalids.length - 1;

          const errors: Record<keyof Omit<ServiceData, "id">, string> = {
            categoryId: "Kategori ayarı",
            channelId: "Kanal ayarı",
            roleId: "Rol ayarı"
          };

          if (invalids.length) {                                                                                       
            const stateResponse = getResponseByState(remaining, ["hiçbiri", "çoğu", "neredeyse hepsi"]);
            const taskResponse = getResponseByState(remaining, ["tamamlanması gereken", "yapılması gereken", "sadece"]);

            // @ts-expect-error Element implicitly has an 'any' type because expression of type 'keyof ServiceData' can't be used to index type 'Record<"categoryId" | "channelId" | "roleId", string>'
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            const errorMessages = invalids.map((key) => errors[key]).join(", ");

            await i.update({ embeds: [SetupView(interaction), withoutAuthor(ErrorView(interaction).setDescription(`Değişikliklerin ${stateResponse} tamamladın, ${taskResponse} ${errorMessages} kısmı kaldı.`))] });
            return;
          }

          await prisma.servers.upsert({
            where: {
              server: interaction.guild!.id,
            },
            update: {
              services: [...services as unknown as  InputJsonValue[], service as unknown as InputJsonValue],
            },
            create: {
              server: interaction.guild!.id,
              services: [...services as unknown as  InputJsonValue[], service as unknown as InputJsonValue],
            }
          });
          await i.update({ embeds: [SetupView(interaction), withoutAuthor(SuccessEmbed(interaction).setDescription("Yapılan değişiklikler başarıyla kaydedildi ve veritabanına kaydedildi."))] });
        }
      })();
    });
  },
});
