import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { buttonRow } from "../functions/general.js";
import { getChannels, getRoles } from "../functions/guilds.js";
import { getCategories } from "../functions/http.js";
import { trim } from "../functions/strings.js";
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
        .setDescription(trim(category.description, 100))
        .setEmoji(category.emoji ? id === category.id ? "✅" : category.emoji : id === category.id ? "<:selected_label:1287491109794091069>" : "<:label:1287490763822731265>")
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

/**
 * Generates a role selection menu for a Discord interaction.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} [params.id=ids.none] - The ID of the selected role.
 * @param {ChatInputCommandInteraction} params.interaction - The Discord interaction object.
 * @returns {ActionRowBuilder<StringSelectMenuBuilder>} - An action row containing the role selection menu.
 */
export const getRole = ({ id = ids.none, interaction }: { id?: string; interaction: ChatInputCommandInteraction; }): ActionRowBuilder<StringSelectMenuBuilder> => {
  const roles = getRoles(interaction.guild).slice(0, 20);

  const defaultOptions = [
    {
      label: "Rol Ayarlaması",
      emoji: "<:role_config:1255187760923541504>",
      isDefault: id === ids.none,
      value: ids.none,
    },
    {
      label: "Kimseyi Bahsetme",
      description: "Bunun yerine hiç kimseyi bahsetmemeyi seçin.",
      emoji: "<:noo:1281242968937730048>",
      isDefault: id === "0",
      value: "0",
    },
    {
      label: "@everyone",
      emoji: "<:world:1272984452380889221>",
      isDefault: id === "1",
      value: "1",
    },
    {
      label: "@here",
      emoji: "<:world:1272984452380889221>",
      isDefault: id === "2",
      value: "2",
    },
  ];

  const defaultMenuOptions = defaultOptions.map(({ label, emoji, description, isDefault, value }) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(label)
      .setEmoji(emoji)
      .setDefault(isDefault)
      .setValue(value)
      .setDescription(description ?? " ")
  );

  const roleOptions = roles.map((role) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(role.name)
      .setEmoji(
        id === role.id
          ? "<:selected_role:1272980146424385711>"
          : "<:role:1272979974932136099>"
      )
      .setValue(role.id)
  );

  const menuBuilder = new StringSelectMenuBuilder()
    .setCustomId("roleId")
    .addOptions(...defaultMenuOptions, ...roleOptions);

  return new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menuBuilder);
};

/**
 * Creates a "Save Changes" button with a custom ID, label, emoji, and primary style.
 *
 * @returns {ActionRowBuilder<ButtonBuilder>} - An action row containing the "Save Changes" button.
 *
 * @example
 * // Generate the save button row
 * const saveButtonRow = getSave();
 * // Use this row in your Discord bot's message
 * await interaction.reply({ content: "Make changes and save:", components: [saveButtonRow] });
 */
export const getSave = (): ActionRowBuilder<ButtonBuilder> => {
  const btn = new ButtonBuilder()
    .setCustomId("save")
    .setLabel("Değişiklikleri Kaydet")
    .setStyle(ButtonStyle.Primary);
  return buttonRow([ btn ]);
};
