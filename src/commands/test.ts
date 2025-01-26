import { Command } from "../classes/command.js";
import { getCategory, getChannel, getRole, getSave } from "../utils/rows.js";
import { SetupView } from "../utils/views.js";

export default new Command({
  data: (builder) => builder
    .setName("test")
    .setDescription("touicho touchio??"),
  async execute(interaction) {
    

    await interaction.editReply({ embeds: [SetupView(interaction)], components: [getCategory(), getChannel({ interaction }), getRole({ interaction }), getSave()] });
  }
});