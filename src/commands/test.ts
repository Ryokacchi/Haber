import { Command } from "../classes/command.js";

export default new Command({
  data: (builder) => builder
    .setName("test")
    .setDescription("touicho touchio??"),
  async execute(interaction) {
    await interaction.editReply("blm");
  }
});