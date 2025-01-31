import { ApplicationIntegrationType, EmbedBuilder, InteractionContextType } from "discord.js";
import { Command } from "../classes/command.js";

export default new Command({
  data: (builder) =>
    builder
  .setName("ping")
    .setDescription("Botun sağlıklı çalıştığını doğrulamak için bu komutu kullanabilirsiniz.")
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall])
    .setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel]),
  async execute(interaction) {
    const PingView = new EmbedBuilder()
      .setColor("#5865f2")
      .setTitle("Tüm haberler elinizin altında.")
      .setDescription(`${interaction.client.user.username}, Türkiye ve dünyadaki en güncel gelişmeleri, haber ve içeriği en kısa sürede ve en pratik şekilde okurlarıyla buluşturan haber uygulamasıdır.`)
      .addFields({
        name: "Biliyoruz! Uzun ve reklam dolu haberleri okumak bir külfettir.",
        value: "İstersen haberi kısaca okuyup hap bilgini kap, istersen haber kaynağına git.",
      })
      .setTimestamp()
      .setFooter({
        text: `©️ 2024 ${interaction.client.user.username}`,
        iconURL: interaction.client.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [PingView] });
  }
});