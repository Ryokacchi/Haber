import { ChannelType, PermissionsBitField, Role, type Guild, type GuildBasedChannel } from "discord.js";

/**
 * Retrieves an array of text channels in a guild where the bot has permission to manage messages.
 *
 * @param {Guild | null} guild - The Discord guild object or null.
 * @returns {GuildBasedChannel[]} An array of text channels where the bot can manage messages, or an empty array if the guild is null.
 */
export function getChannels(guild: Guild | null): GuildBasedChannel[] {
  if (!guild) return [];

  const bot = guild.members.me;
  if (!bot) return [];

  return guild.channels.cache
    .filter(
      (channel) =>
        channel.type === ChannelType.GuildText &&
        channel.permissionsFor(bot).has(PermissionsBitField.Flags.ManageMessages)
    )
    .toJSON();
} 


/**
 * Retrieves the roles from a given guild excluding the bot roles and the default "@everyone" role.
 * @param {Guild | null} guild - The guild object from which to retrieve roles.
 * @returns {Role[] | undefined} An array of roles excluding bot and "@everyone" roles, or undefined if no guild is provided.
 */
export function getRoles(guild: Guild | null): Role[] {
  if (!guild) return [];
  return guild.roles.cache
    .filter(role => !role.tags?.botId && role.name !== "@everyone")
    .toJSON();
}
