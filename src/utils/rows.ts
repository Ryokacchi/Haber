import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { getCategories } from "../functions/http.js";
import ids from "./ids.js";

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
        .setEmoji("<:label:1287490763822731265>")
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
