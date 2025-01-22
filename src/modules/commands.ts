import { readdir } from "fs/promises";
import path from "path";
import type { Command } from "../classes/command.js";
import type { CommandImport, SlashCommandBuilders } from "../interfaces/files.types.js";

const commandMap = new Map<string, Command>();
const commandsDir = "commands";

/**
 * Returns all registered commands as a flattened array.
 * 
 * @returns {Command[]} An array containing all registered command handlers.
 * 
 * @example
 * const commands = getCommands();
 * console.log(`Total registered commands: ${commands.length}`);
 */
export function getCommands(): Command[] {
  return Array.from(commandMap.values()).flat();
}

/**
 * Returns the command with the specified name.
 * 
 * @param {string} name - The name of the command to search for
 * @returns {Command | undefined} The found command or undefined if not found
 * 
 * @example
 * const pingCommand = getCommandByName('ping');
 * if (pingCommand) {
 *   console.log('Ping command found');
 * }
 */
export function getCommandByName(name: string): Command | undefined {
  return commandMap.get(name);
}

/**
 * Returns an array of built slash command data for all registered commands.
 * 
 * This function maps over all registered commands and calls their build() method
 * to generate the slash command data structures needed by Discord.js.
 * 
 * @returns {SlashCommandBuilders[]} An array containing the built slash command data for all commands
 * 
 * @example
 * const slashCommands = getSlashBuilders();
 * console.log(`Built ${slashCommands.length} slash commands`);
 */
export function getSlashBuilders(): SlashCommandBuilders[] {
  return getCommands().map((command) => command.build());
}

/**
 * Reloads all command handlers from the commands directory.
 * 
 * This function:
 * 1. Reads all TypeScript files from the commands directory recursively
 * 2. Imports each command file and registers the command handler
 * 3. Adds the command to the commandMap for tracking using the command name
 * 
 * @async
 * @returns {Promise<void>} A promise that resolves when all commands are loaded
 * 
 * @example
 * await reloadCommand();
 * console.log('All command handlers reloaded successfully');
 * 
 * @throws {Error} If there is an error reading the directory or importing command files
 */
export async function relaodCommands(): Promise<void> {
  const basePath = path.join("src", commandsDir);
  const files = (await readdir(basePath, { withFileTypes: true, recursive: true }))
    .filter((file) => file.isFile() && file.name.endsWith(".ts") && !file.name.endsWith(".d.ts"));

  await Promise.all(files.map(async (file) => {
    const filePath = path.join(basePath, file.name);
    
    const fileImportPath = `../../${filePath}`;
    const fileImport = await import(fileImportPath) as CommandImport;

    const result = fileImport.default;
    commandMap.set(result.build().name, result);
  }));
}