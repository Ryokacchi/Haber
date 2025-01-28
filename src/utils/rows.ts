import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { buttonRow } from "../functions/general.js";
import { getChannels, getRoles } from "../functions/guilds.js";
import { getCategories } from "../functions/http.js";
import { trim } from "../functions/strings.js";
import { ids } from "./constants.js";

/**
 * Generates a category selection menu for a Discord interaction.
 *
 * This menu allows users to select a category from the provided list. It excludes categories already in the provided array
 * and highlights the currently selected category. The menu can be disabled if needed.
 *
 * @param {Object} params - The parameters for the category selection menu.
 * @param {string} [params.id=ids.none] - The ID of the currently selected category. Defaults to `ids.none`.
 * @param {string[]} [params.array=[]] - An array of category IDs to exclude from the menu.
 * @param {boolean} [params.disabled=false] - Determines whether the menu is disabled.
 * @returns {ActionRowBuilder<StringSelectMenuBuilder>} - An action row containing the category selection menu.
 *
 * @example
 * // Create a category selection menu
 * const categoryMenu = getCategory({ id: "1234567890", array: ["111", "222"], disabled: false });
 */
export const getCategory = ({ id = ids.none, array = [], disabled = false, }: { id?: string; array?: string[]; disabled?: boolean; } = {}): ActionRowBuilder<StringSelectMenuBuilder> => {
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
    .setDisabled(categories.length === 0 || disabled)
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
 * Generates a channel selection menu for a Discord interaction.
 *
 * This menu allows users to select a channel from the server, excluding the current interaction channel. It highlights the
 * currently selected channel and includes an option for channel configuration. The menu can be disabled if needed.
 *
 * @param {Object} params - The parameters for the channel selection menu.
 * @param {string} [params.id=ids.none] - The ID of the currently selected channel. Defaults to `ids.none`.
 * @param {ChatInputCommandInteraction} params.interaction - The Discord interaction object to fetch guild channels.
 * @param {boolean} [params.disabled=false] - Determines whether the menu is disabled.
 * @returns {ActionRowBuilder<StringSelectMenuBuilder>} - An action row containing the channel selection menu.
 *
 * @example
 * // Create a channel selection menu for a command interaction
 * const channelMenu = getChannel({ id: "1234567890", interaction, disabled: false });
 */
export const getChannel = ({ id = ids.none, interaction, disabled = false, }: { id?: string; interaction: ChatInputCommandInteraction; disabled?: boolean; }): ActionRowBuilder<StringSelectMenuBuilder> => {
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
      .setDefault(id === channel.id)
      .setValue(channel.id)
  );

  const menuBuilder = new StringSelectMenuBuilder()
    .setCustomId("channelId")
    .setDisabled(disabled)
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
 * This menu allows users to select a role from the server. It includes default options like "Do not mention anyone",
 * "@everyone", and "@here" alongside the first 20 roles fetched from the guild. The menu highlights the currently selected role
 * and can be disabled if needed.
 *
 * @param {Object} params - The parameters for the role selection menu.
 * @param {string} [params.id=ids.none] - The ID of the currently selected role. Defaults to `ids.none`.
 * @param {ChatInputCommandInteraction} params.interaction - The Discord interaction object to fetch guild roles.
 * @param {boolean} [params.disabled=false] - Determines whether the menu is disabled.
 * @returns {ActionRowBuilder<StringSelectMenuBuilder>} - An action row containing the role selection menu.
 *
 * @example
 * // Create a role selection menu for a command interaction
 * const roleMenu = getRole({ id: "1234567890", interaction, disabled: false });
 */
export const getRole = ({ id = ids.none, interaction, disabled = false, }: { id?: string; interaction: ChatInputCommandInteraction; disabled?: boolean; }): ActionRowBuilder<StringSelectMenuBuilder> => {
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
      .setDefault(id === role.id)
      .setValue(role.id)
  );

  const menuBuilder = new StringSelectMenuBuilder()
    .setCustomId("roleId")
    .setDisabled(disabled)
    .addOptions(...defaultMenuOptions, ...roleOptions);

  return new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(menuBuilder);
};

/**
 * Creates a "Save Changes" button with customizable enabled/disabled state.
 *
 * @param {Object} params - The parameters for the button configuration.
 * @param {boolean} params.disabled - Determines whether the button is disabled.
 * @returns {ActionRowBuilder<ButtonBuilder>} - An action row containing the "Save Changes" button.
 *
 * @example
 * // Generate an enabled save button row
 * const saveButtonRow = getSave({ disabled: false });
 * 
 * @example
 * // Generate a disabled save button row
 * const saveButtonRow = getSave({ disabled: true });
 */
export const getSave = ({ disabled = false }: { disabled?: boolean; } = {}): ActionRowBuilder<ButtonBuilder> => {
  const btn = new ButtonBuilder()
    .setCustomId("save")
    .setDisabled(disabled)
    .setLabel("Değişiklikleri Kaydet")
    .setStyle(ButtonStyle.Primary);
  return buttonRow([ btn ]);
};
