import { Event } from "../classes/event.js";
import { getCommandByName } from "../modules/commands.js";
import { LoadingView } from "../utils/views.js";

export default new Event({
  categoryName: "interactionCreate",
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await interaction.deferReply();
      await interaction.followUp({ embeds: [LoadingView(interaction)] });

      const commandName = interaction.commandName;
      const command = getCommandByName(commandName);

      if (command) {
        command.execute(interaction);
      }
    }
  }
});