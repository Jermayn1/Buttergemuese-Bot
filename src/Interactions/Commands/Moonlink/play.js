const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Client, MessageFlags, Message } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Spielt Musik ab")
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
    .addStringOption((options) => options
        .setName("suche")
        .setDescription("Gib ein den Namen oder ein Link vom Song ein! (Es sollte YouTube und Spotify) funktioneren!")
        .setRequired(true)
    ),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {

        // Prüft ob der Member im VoiceChannel ist
        if (!interaction.member.voice.channelId == null) return interaction.reply({
            content: "Du bist nicht in einen Voice Channel!",
            flags: [MessageFlags.Ephemeral]
        });

        // Prüft, die Eingabe von der "suche"
        const content = interaction.options.getString("suche");
        if (!content) return interaction.reply({
            content: "Du musst etwas in der Suche eingeben!",
            flags: [MessageFlags.Ephemeral]
        });

        // Step 3: Create a player for the guild.
        // If a player already exists, it will be retrieved. Otherwise, a new one is created.
        // This player instance handles everything related to music in a specific guild.
        const player = client.manager.players.create({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channelId,
            textChannelId: interaction.channel.id,
            autoPlay: true,
        });

        // Step 4: Connect to the voice channel.
        // This establishes the connection so the bot can play audio.
        player.connect();

        // Step 5: Search for the requested track.
        // Moonlink.js will search on the default platform (usually YouTube)
        const searchResult = await client.manager.search({
            query: content,
            requester: interaction.member.id
        });

        // Step 6: Handle the search results.
        // First, check if any tracks were found.
        if (!searchResult.tracks.length) {
        return interaction.reply({ content: 'No results found for your query.'});
        }

        // Step 7: Process the results based on the load type.
        // The loadType indicates whether a playlist, a single track, or a search result was returned.
        switch (searchResult.loadType) {
        case 'playlist':
            // If a playlist is found, add all its tracks to the queue.
            player.queue.add(searchResult.tracks);
            
            interaction.reply({
            content: `Added playlist **${searchResult.playlistInfo.name}** with ${searchResult.tracks.length} tracks to the queue.`,
            });
            
            // If the player is not already playing, start playback.
            if (!player.playing) {
            player.play();
            }
            break;
            
        case 'search':
        case 'track':
            // If a single track or a search result is found, add the first track to the queue.
            player.queue.add(searchResult.tracks[0]);
            
            interaction.reply({
            content: `Added **${searchResult.tracks[0].title}** to the queue.`,
            });
            
            // If the player is not already playing, start playback.
            if (!player.playing) {
            player.play();
            }
            break;
            
        case 'empty':
            // If no matches are found for the query.
            interaction.reply('No matches found for your query!');
            break;
            
        case 'error':
            // If an error occurred while loading the track.
            interaction.reply(`An error occurred while loading the track: ${searchResult.error || 'Unknown error'}`);
            break;
        }
    }
}