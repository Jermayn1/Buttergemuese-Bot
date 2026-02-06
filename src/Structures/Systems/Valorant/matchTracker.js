const axios = require("axios");
const ValorantLink = require("../../Schemes/valorantLink");
const ValoChannel = require("../../Schemes/valoChannel");

module.exports = (client) => {
    setInterval(async () => {
        const users = await ValorantLink.find();

        for (const user of users) {
            try {
                const res = await axios.get(`https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/${user.Region}/${user.PUUID}`,
                {
                    headers: { Authorization: process.env.HENRIK_API_KEY }
                });

                const match = res.data.data[0];
                if (!match) continue;

                if (!user.LastMatchId) {
                    user.LastMatchId = match.metadata.matchid;
                    await user.save();
                    continue; // NICHT senden beim ersten Mal
                }

                if (match.metadata.matchid === user.LastMatchId) continue;

                user.LastMatchId = match.metadata.matchid;
                await user.save();

                const result = extractResult(match, user.PUUID);
                await sendToChannel(client, user.Guild, result);

            } catch (err) {
                console.log("Tracker Fehler:", err.message);
            }
        }
    }, 180000) // 30 Sekunden

};

function extractResult(match, puuid) {
    const player = match.players.all_players.find(p => p.puuid === puuid);

    const team = player.team.toLowerCase();
    const blue = match.teams.blue.rounds_won;
    const red = match.teams.red.rounds_won;

    const win =
        (team === "blue" && blue > red) ||
        (team === "red" && red > blue);

    const mode = match.metadata.mode;
    const isRanked = mode === "competitive";
    const rank = isRanked ? player.stats.rank || player.competitiveTier : null;
    const mmrChange = isRanked ? player.stats.mmr_change_to_last_game : null;

    return {
        map: match.metadata.map,
        agent: player.character,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        score: `${blue} : ${red}`,
        win,
        mode,
        isRanked,
        rank,
        mmrChange
    };
}

async function sendToChannel(client, guildId, result) {
    const data = await ValoChannel.findOne({ Guild: guildId });
    if (!data) return;

    const channel = await client.channels.fetch(data.Channel);
    if (!channel) return;

    const { EmbedBuilder } = require("discord.js");

    const embed = new EmbedBuilder()
        .setColor(result.win ? "#00ff99" : "#ff4655")
        .setTitle(result.score)
        .addFields(
        { name: "Map", value: result.map, inline: true },
        { name: "Agent", value: result.agent, inline: true },
        { name: "Score", value: result.score, inline: true },
        { name: "K/D/A", value: `${result.kills}/${result.deaths}/${result.assists}`, inline: true },
        // { name: "Ergebnis", value: result.win ? "GEWONNEN ✅" : "VERLOREN ❌", inline: true }
        )
        .setTimestamp()
        .setFooter({ text: "Nachricht muss noch schöner gemacht werden, ist nur zum testen"});

    channel.send({ embeds: [embed] });
}

