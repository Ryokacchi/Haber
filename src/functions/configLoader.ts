import fs from "fs";
import yaml from "js-yaml";
import type { ConfigData } from "../interfaces/files.types.js";

const configPath = "./config.yml";

/**
 * Reads the configuration file and returns the configuration data
 * @returns {ConfigData} The configuration data
 * @throws {Error} If the configuration file cannot be read or contains invalid YAML format
 */
export function getConfig(): ConfigData {
	const fileData = fs.existsSync(configPath) ? yaml.load(fs.readFileSync(configPath, "utf-8")) : {};
	return fileData as ConfigData;
}

export const config = getConfig();