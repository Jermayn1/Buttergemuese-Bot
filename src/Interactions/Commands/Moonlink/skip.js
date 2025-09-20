const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Client, MessageFlags, Message } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Weg mit dem aktuellen Track!")
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
                content: "Du musst im selben Channel sein wo die Musik gespielt wird, um ein Track zu skippen! Ich habe autismososos SOOOS"
        });

        if (!player.current) return interaction.reply({
            content: "Es gibt aktuell nichts zum abspielen!"
        });

        const currentTrack = player.current;
        player.skip();

        interaction.reply({
            content: `Skipped: **${currentTrack.title}** - now Playing (EINFÜGEN BIN ZUU FAUL WIE EIN GAUUUL)`
        })




    }
}