const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Client, MessageFlags, Message } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Zeigt die aktuelle Warteschlange an, oft ist nen HAftbefehl song dabei")
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

        // Step 3: Check if there are tracks in the queue
        if (!player.current && player.queue.size === 0) return interaction.reply({
            content: "Es ist nichts in der Warteschlange!"
        });

        // Step 4: Format duration for display
        // This helper function converts milliseconds to a readable format
        const formatDuration = (ms) => {
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / (1000 * 60)) % 60);
            const hours = Math.floor(ms / (1000 * 60 * 60));

            return `${hours ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

            // Step 5: Create an embed for the queue
        // Embeds provide a nice, formatted way to display information
        const embed = new EmbedBuilder()
            .setTitle("Aktuelle Warteschlange")
            .setColor(client.config.color.normal);

        // Step 6: Add the current track to the embed
        if (player.current) {
            embed.setDescription(`**Spielt aktuell:**\n[${player.current.title}](${player.current.url}) | \`${formatDuration(player.current.duration)}\``);
        }

        // Step 7: Add the queue tracks to the embed
        if (player.queue.size > 0) {
            const tracks = player.queue.tracks.map((track, index) => {
                return `${index + 1}. [${track.title}](${track.url}) | \`${formatDuration(track.duration)}\``;
            });

            embed.addFields({
                name: 'Als nächstes:',
                value: tracks.slice(0, 10).join('\n'),
            });

            // If there are more than 10 tracks, add a note
            if (player.queue.size > 10) {
                embed.addFields({
                name: 'Weitere...',
                value: `${player.queue.size - 10} more tracks in the queue`,
                });
            }
        }
        
        interaction.reply({
            embeds: [embed]
        });
    }
}