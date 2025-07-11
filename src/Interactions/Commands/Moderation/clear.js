const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Client, MessageFlags, Message } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Entfernt eine bestimmte Anzahl von Nachrichten von einem Benutzer oder aus einem Channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((options) => options
        .setName("anzahl")
        .setDescription("Die Anzahl der zu entfernenden Nachrichten.")
        .setMinValue(1)
        .setRequired(true)
    )
    .addUserOption((options) => options
        .setName("benutzer")
        .setDescription("Ein Benutzer, dessen Nachrichten entfernt werden sollen.")
        .setRequired(false)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser("benutzer");

        let amount = interaction.options.getInteger("anzahl");
        if (amount > 100) amount = 100;

        let fetch;

        if (user) {
            const messages = await interaction.channel.messages.fetch();
            const filteredMessages = messages.filter((m) => m.author.id === user.id);
            fetch = Array.from(filteredMessages.values()).slice(0, amount)
        } else {
            fetch = await interaction.channel.messages.fetch({ limit: amount });
        }

        const embed = new EmbedBuilder()
        .setColor(client.config.color.normal)
        .setTimestamp();

        if(fetch.size == "0" || fetch.length == "0") return interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [ embed
                .setTitle("Ich konnte keine Nachrichten finden!")
                .setDescription(`Möglicherweise gibt es keine Nachrichten in diesem ${user == null ? "in diesem Channel" : "von diesem Mitglied in diesem Channel"}.`)
            ]
        });

        let deletedMessages = await interaction.channel.bulkDelete(fetch, true);

        const results = {};

        const userMessageMap = await Object.entries(results);

        const msg = await interaction.reply({
            flags: [MessageFlags.Ephemeral],
            embeds: [embed
            .setTitle(`🧹 ${deletedMessages.size} Nachricht${deletedMessages.size > 1 ? "en" : "" || deletedMessages.size == 0 ? "en" : ""} wurden entfernt!`)
            ]
        });

        setTimeout(async () => {
            try { msg.delete() } catch(e) { }
        }, 5000);
    }
}