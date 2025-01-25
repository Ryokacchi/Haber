import { Command } from "../classes/command.js";
import { getCategory, getChannel } from "../utils/rows.js";

export default new Command({
  data: (builder) => builder
    .setName("test")
    .setDescription("touicho touchio??"),
  async execute(interaction) {
    

    await interaction.editReply({ components: [getCategory(), getChannel({ interaction })] });
  }
});