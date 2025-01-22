import { SlashCommandBuilder } from "discord.js";
import type { CommandOptions } from "../interfaces/files.types.js";

export class Command {
  constructor(private readonly commandOptions: CommandOptions) {
    this.commandOptions.data = commandOptions.data;
    this.commandOptions.execute = commandOptions.execute;
  }

  public get data() {
    return this.commandOptions.data;
  }

  public get execute() {
    return this.commandOptions.execute;
  }

  public build() {
    return this.commandOptions.data(new SlashCommandBuilder());
  }
}