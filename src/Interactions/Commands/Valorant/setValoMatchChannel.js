const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, MessageFlags } = require("discord.js");
const ValoChannel = require("../../../Structures/Schemes/valoChannel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setvalomatchchannel")
    .setDescription("Setzt den Channel für Valorant Match Logs")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt =>
      opt.setName("channel")
         .setDescription("Channel auswählen")
         .setRequired(true)
    ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
  async execute(interaction) {

    const channel = interaction.options.getChannel("channel");

    await ValoChannel.findOneAndUpdate(
      { Guild: interaction.guild.id },
      { Guild: interaction.guild.id, Channel: channel.id },
      { upsert: true }
    );

    interaction.reply({
        content: `✅ Match Logs werden jetzt in <#${channel.id}> gesendet.`,
        flags: [MessageFlags.Ephemeral]
    })
  }
};
