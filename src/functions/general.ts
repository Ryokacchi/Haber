import type { ButtonBuilder, StringSelectMenuBuilder } from "@discordjs/builders";
import { AxiosError } from "axios";
import { ActionRowBuilder, type AnyComponentBuilder } from "discord.js";
import { promisify } from "util";
import { eventLog } from "../modules/variables.js";

export const wait = promisify(setTimeout);

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

/**
 * Logs error messages using `eventLog.error`.  
 * - If the error is an instance of `Error`, logs the error message.  
 * - If the error is an instance of `AxiosError`, logs the response data if available.  
 * - Logs the error in all cases.  
 *  
 * @param {unknown} error - The error to handle and log.  
 */
export function tryAndCatch(error: unknown) {
  if (error instanceof Error) {
    eventLog.error(error.message);
  } else if (error instanceof AxiosError) {
    eventLog.error(error.response?.data);
  }

  eventLog.error(String(error));
}

/**
 * Generates a mention for a role based on its ID.
 *
 * @param {string} id - The role ID.
 * @returns {string} The role mention string
 */
export function roleMention(id: string): string  {
  switch (id) {
    case "0":
    case "none":
      return "";
    case "1":
      return "@here";
    case "2":
      return "@everyone";
    default:
      return `<@&${id}>`;
  }
}
