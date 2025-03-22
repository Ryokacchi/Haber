import { dirname, join } from "path";
import { fileURLToPath } from "url";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

/**
 * Trims a string to a specified maximum length and appends ellipsis ("...") if the string exceeds the maximum length.
 * 
 * @param {string} str - The input string to be trimmed.
 * @param {number} max - The maximum allowed length for the string.
 * @returns {string} - The trimmed string with ellipsis if it exceeds the maximum length, or the original string otherwise.
 * 
 * @example
 * // Short string, no trimming needed
 * trim("Hello", 10); // "Hello"
 * 
 * @example
 * // String longer than max length
 * trim("Hello, World!", 8); // "Hello..."
 */
export const trim = (str: string, max: number): string => str.length > max ? `${str.slice(0, max - 3)}...` : str;

/**
 * Replaces the last comma in a string with " ve".
 * This is typically used for creating a more natural list separator in a sentence.
 *
 * @param {string} str - The input string containing commas.
 * @returns {string} - The modified string with the last comma replaced by " ve".
 */
export const and = (str: string): string => str.replace(/,(?=[^,]*$)/, " ve");

/**
 * Joins the current working directory with a given set of paths.
 *
 * @param {string[]} path - A list of path segments to join to the current working directory.
 * @returns {string} The full file path after joining the current working directory with the provided segments.
 */
export const fileify = (...path: string[]): string => join(process.cwd(), "src", ...path);

/**
 * Retrieves the element from an array based on the provided state index.
 *
 * @param {number} state - The index of the element to retrieve from the array.
 * @param {string[]} array - The array containing the elements.
 * @returns {string} - The element from the array at the specified index.
 */
export const getResponseByState = (state: number, array: string[]): string => array.reverse()[state] ?? "";
