import type { Awaitable, ChatInputCommandInteraction, ClientEvents, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import type { Command } from "../classes/command.js";
import { Event } from "../classes/event.js";

export type Categories = keyof ClientEvents;

export interface EventOptions<Category extends Categories> {
  categoryName: Category;
  execute: EventExecuteFunction<Category>;
}

export type EventExecuteFunction<Category extends Categories> = (...args: ClientEvents[Category]) => Awaited<unknown>;

export interface EventImport {
  default: Event;
}

export interface CommandImport {
  default: Command;
};

export type SlashCommandBuilders =
  | SlashCommandBuilder
  | SlashCommandSubcommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandGroupBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;

export type CommandBuilderData = ((builder: SlashCommandBuilder) => SlashCommandBuilders)
export type CommandExecuteFunction = (interaction: ChatInputCommandInteraction) => Awaitable<unknown>;

export interface CommandOptions {
  data: CommandBuilderData;
  execute: CommandExecuteFunction;
}

export interface ConfigBot {
  token: string;
  developers: string[];
}

export interface ConfigData {
  bot: ConfigBot;
}