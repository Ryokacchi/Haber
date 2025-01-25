import { ActionRowBuilder, ChatInputCommandInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { getChannels } from "../functions/guilds.js";
import { getCategories } from "../functions/http.js";
import { ids } from "./constants.js";

/**
 * Creates a category selection component as an Action Row for Discord.
 *
 * This component allows users to select a category from a dropdown menu. It highlights the currently selected category
 * and disables the dropdown if all categories are included.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.id - The currently selected category ID.
 * @param {string[]} props.array - An array of category IDs to include in the dropdown.
 * @returns {ActionRowBuilder<StringSelectMenuBuilder>} A configured ActionRowBuilder containing the category selection menu.
 */
export const getCategory = ({ id = ids.none, array = [] }: { id?: string; array?: string[] } = {}): ActionRowBuilder<StringSelectMenuBuilder> => {
  const allCategories = getCategories();
  
  const categories = allCategories
    .filter((category) => !array.includes(category.id))
    .map((category) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(category.name)
        .setEmoji(id === category.id ? "<:selected_label:1287491109794091069>" : "<:label:1287490763822731265>")
        .setDefault(id === category.id)
        .setValue(category.id)
    );

  const builder = new StringSelectMenuBuilder()
    .setCustomId("categoryId")
    .setDisabled(categories.length === 0)
    .setOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Kategori Ayarlaması")
        .setEmoji("<:1287500418380730408:1332691585569132675>")
        .setDefault(id === ids.none)
        .setValue(ids.none)
    )
    .addOptions([...categories]);

  return new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(builder);
};

/**
 * Creates a dropdown menu for channel selection with a maximum of 20 channels, excluding the current channel.
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.id=ids.none] - The selected channel ID. Defaults to `ids.none`.
 * @param {ChatInputCommandInteraction} params.interaction - The interaction object from Discord.
 * @returns {ActionRowBuilder<StringSelectMenuBuilder>} A row containing a dropdown menu for channel selection.
 */
export const getChannel = ({ id = ids.none, interaction }: { id?: string; interaction: ChatInputCommandInteraction; }): ActionRowBuilder<StringSelectMenuBuilder> => {
  const channels = getChannels(interaction.guild)
    .slice(0, 20)
    .filter((channel) => channel.id !== interaction.channelId);

  const currentChannel = interaction.guild?.channels.cache.get(interaction.channel?.id ?? "");

  const options = channels.map((channel) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(channel.name)
      .setEmoji(
        id === channel.id
          ? "<:selected_channel:1273024042877845524>"
          : "<:channel:1273024021155283005>"
      )
      .setValue(channel.id)
  );

  const menuBuilder = new StringSelectMenuBuilder()
    .setCustomId("channelId")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Kanal Ayarlaması")
        .setEmoji("<:channel_config:1256366038660939846>")
        .setDefault(id === ids.none)
        .setValue(ids.none),
      ...(currentChannel
        ? [
            new StringSelectMenuOptionBuilder()
              .setLabel(currentChannel.name)
              .setEmoji(
                id === currentChannel.id
                  ? "<:selected_channel:1273024042877845524>"
                  : "<:channel:1273024021155283005>"
              )
              .setDefault(id === currentChannel.id)
              .setValue(currentChannel.id),
          ]
        : []),
      ...options
    );

  return new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menuBuilder);
};