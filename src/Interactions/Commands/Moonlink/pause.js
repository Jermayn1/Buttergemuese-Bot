const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Client, MessageFlags, Message } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausiert den aktuellen fetten BEAT")
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        const player = client.manager.players.get(interaction.guild.id);

        if (!player) return interaction.reply({
            content: "Es gibt nichts zum abspielen auf diesen Server!"
        });

        if (interaction.member.voice.channel.id != player.voiceChannelId)
            return interaction.reply({
                content: "Du musst im selben Channel sein wo die Musik gespielt wird, um MUKE ZU PAUSIEREN! Ich habe autismososos SOOOS"
        });

        if (player.paused) return interaction.reply({
            content: "Bist du dumm? Die Musik ist bereits pausiert!"
        });

        player.pause();

        interaction.reply({
            content: "Muke ist jetzt pausiert!"
        });
    }
}