import type { ClientEvents } from "discord.js";
import { readdir } from "fs/promises";
import path from "path";
import { Event } from "../classes/event.js";
import type { Categories, EventImport } from "../interfaces/files.types.js";
import { client } from "../modules/client.js";

const eventMap = new Map<Categories, Event[]>();
const eventsDir = "events";

/**
 * Returns all registered events as a flattened array.
 * 
 * @returns {Event[]} An array containing all registered event handlers.
 * 
 * @example
 * const events = getEvents();
 * console.log(`Total registered events: ${events.length}`);
 */
export function getEvents(): Event[] {
  return Array.from(eventMap.values()).flat();
}

/**
 * Returns all event handlers registered for a specific category.
 * 
 * @template Category - The event category type extending ClientEvents
 * @param {Category} category - The event category to get handlers for
 * @returns {Event<Category>[]} An array of event handlers for the specified category
 * 
 * @example
 * const readyEvents = getCategory('ready');
 * console.log(`Ready event handlers: ${readyEvents.length}`);
 */
export function getCategory<Category extends keyof ClientEvents>(category: Category): Event<Category>[] {
  const events = eventMap.get(category) as unknown as | Event<Category>[] | undefined;
  return events ?? [];
}

/**
 * Reloads all event handlers from the events directory.
 * 
 * This function:
 * 1. Reads all TypeScript files from the events directory recursively
 * 2. Imports each event file and registers the event handler
 * 3. Adds the event to the eventMap for tracking
 * 4. Attaches the event handler to the Discord client
 * 
 * @async
 * @returns {Promise<void>} A promise that resolves when all events are loaded
 * 
 * @example
 * await reloadEvents();
 * console.log('All event handlers reloaded successfully');
 * 
 * @throws {Error} If there is an error reading the directory or importing event files
 */
export async function reloadEvents(): Promise<void> {
  const basePath = path.join("src", eventsDir);
  const files = (await readdir(basePath, { withFileTypes: true, recursive: true }))
    .filter((file) => file.isFile() && file.name.endsWith(".ts") && !file.name.endsWith(".d.ts"));
  
  await Promise.all(files.map(async (file) => {
    const filePath = path.join(basePath, file.name);
    
    const fileImportPath = `../../${filePath}`;
    const fileImport = await import(fileImportPath) as EventImport;

    const result = fileImport.default;
    const events = eventMap.get(result.categoryName) ?? [];

    eventMap.set(result.categoryName, [...events, result]);
    client.on(result.categoryName, result.execute);
  }));
}