const { SlashCommandBuilder } = require("discord.js");
const voice = require("../utils/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alwaysinvoice")
    .setDescription("Lässt den Bot dauerhaft einem Voice-Channel beitreten.")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Voice-Channel, den der Bot joinen soll")
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    if (!channel.isVoiceBased()) {
      return interaction.reply({ content: "❌ Das ist kein Voice-Channel!", ephemeral: true });
    }

    await voice.joinAndStay(channel);
    await interaction.reply(`✅ Bin jetzt dauerhaft in **${channel.name}**!`);
  }
};
