import type { ButtonBuilder, StringSelectMenuBuilder } from "@discordjs/builders";
import { ActionRowBuilder, type AnyComponentBuilder } from "discord.js";

/**
 * Creates an action row with the given component builders
 * @template T Type of component builder extending AnyComponentBuilder
 * @param {T[]} builders Array of component builders to add to the row
 * @returns {ActionRowBuilder<T>} Action row containing the components
 */
export function anyRow<T extends AnyComponentBuilder>(builders: T[]): ActionRowBuilder<T> {
  const builder = new ActionRowBuilder<T>();
  return builder.setComponents(builders);
}

/**
 * Creates an action row with the given button builders
 * @param {ButtonBuilder[]} buttons Array of button builders to add to the row
 * @returns {ActionRowBuilder<ButtonBuilder>} Action row containing the buttons
 */
export const buttonRow = (buttons: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder> => anyRow<ButtonBuilder>(buttons);

/**
 * Creates an action row with the given select menu builders 
 * @param {StringSelectMenuBuilder[]} selects Array of select menu builders to add to the row
 * @returns {ActionRowBuilder<StringSelectMenuBuilder>} Action row containing the select menus
 */
export const stringRow = (selects: StringSelectMenuBuilder[]): ActionRowBuilder<StringSelectMenuBuilder> => anyRow<StringSelectMenuBuilder>(selects);