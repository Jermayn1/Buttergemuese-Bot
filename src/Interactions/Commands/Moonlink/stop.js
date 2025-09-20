const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Client, MessageFlags, Message } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stopt die Muke und löscht die Warteschlange")
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
                content: "Du musst im selben Channel sein wo die Musik gespielt wird, um die Party zu stoppen! Ich habe autismososos SOOOS"
        });

        player.stop();
        player.queue.clear();

        interaction.reply({
            content: `MUSIK AUS UND WARTESCHLANGE LEER WIE GOAY`
        })




    }
}