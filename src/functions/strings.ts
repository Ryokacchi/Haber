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
