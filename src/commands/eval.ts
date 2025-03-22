import { codeBlock, EmbedBuilder, InteractionContextType } from "discord.js";
import { Command } from "../classes/command.js";
import { checkDeveloper } from "../functions/general.js";
import { ErrorView } from "../utils/views.js";

export default new Command({
  data: (builder) =>
    builder
      .setName("eval")
      .setDescription("Geliştiriciler için kod parçacığı deneyebilirsiniz.")
      .addStringOption((input) => input.setName("code").setDescription("Denemek istediğiniz kod parçacığını giriniz.").setRequired(true))
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
  async execute(interaction) {
    if (!(checkDeveloper(interaction.user.id))) {
      await interaction.editReply({
        embeds: [ErrorView(interaction).setDescription("Bu komutu kullanabilmek için `Geliştirici` rozetine sahip olamlısınız.")]
      });
      return;
    }

    const code = interaction.options.getString("code", true);
    const startNow = performance.now();

    const ResultView = new EmbedBuilder()
      .setAuthor({
        name: `${interaction.user.displayName} (@${interaction.user.username})`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle("Kod Çalıştırma İşlemleri")
      .setDescription("Bu süreç, geliştiricilerin kodun çıktısını görmesini, hata ayıklamasını ve işlevselliğini test etmesini sağlar.")
      .setFields([
        { name: "**‧** Girdi:", value: codeBlock("js", code) }
      ]); 
    
   try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = eval(code);
      ResultView.setColor("#5865f2").addFields({ name: "**‧** Çıktı:", value: codeBlock("js", String(result)) });
    } catch (error) {
      ResultView.setColor("#ed4245").addFields({ name: "**‧** Hata:", value: codeBlock("js", String(error)) });
    }

    const endNow = performance.now();
    ResultView.setFooter({ text: `İşlem süresi: ~${String(Intl.NumberFormat().format(~~(endNow - startNow)))}ms`,  iconURL: interaction.client.user.displayAvatarURL(), });

    await interaction.editReply({ embeds: [ResultView] });
  }
});