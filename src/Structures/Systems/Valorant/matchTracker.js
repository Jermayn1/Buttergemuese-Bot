const axios = require("axios");
const ValorantLink = require("../../Schemes/valorantLink");
const ValoChannel = require("../../Schemes/valoChannel");

let mapCache = {}; // Speichert die Map Bilder (Breite lange)

module.exports = (client) => {
    setInterval(async () => {
        if (Object.keys(mapCache).length === 0) {
            await loadMapData();
        }

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

                const result = extractResult(match, user.PUUID, user.Region);
                await sendToChannel(client, user.Guild, result);

            } catch (err) {
                console.log("Tracker Fehler:", err.message);
            }
        }
    }, 90000)

};

async function extractResult(match, puuid, region) {
    const player = match.players.all_players.find(p => p.puuid === puuid);

    const team = player.team.toLowerCase();
    const blue = match.teams.blue.rounds_won;
    const red = match.teams.red.rounds_won;

    const ownScore = team === "blue" ? blue : red;
    const enemyScore = team === "blue" ? red : blue;

    const win =
        (team === "blue" && blue > red) ||
        (team === "red" && red > blue);

    const mode = match.metadata.mode;
    const isRanked = mode === "Competitive";
    const rank = isRanked ? (player.currenttier_patched || "Unranked") : null;
    let mmrChange = null;
    if (isRanked) {
        const mmrData = await getMMRData(region, puuid);
        mmrChange = mmrData.mmrChange;
    }

    const matchDurationMinutes = Math.floor(match.metadata.game_length / 60);

    const teamPlayers = match.players[team]; // red oder blue
    const isTeamMVP = teamPlayers.every(p => player.stats.score >= p.stats.score);

    const allPlayers = match.players.all_players;
    const isMatchMVP = allPlayers.every(p => player.stats.score >= p.stats.score);

    return {
        playerName: player.name,
        playerTag: player.tag,
        matchId: match.metadata.matchid,
        map: match.metadata.map,
        agent: player.character,
        agentIcon: player.assets.agent.small,
        mapImage: mapCache[match.metadata.map] || null,
        kills: player.stats.kills,
        deaths: player.stats.deaths,
        assists: player.stats.assists,
        headshotPercent: Math.round((player.stats.headshots / (player.stats.headshots + player.stats.bodyshots + player.stats.legshots) * 100) * 100) / 100,
        kd: player.stats.deaths > 0 ? (player.stats.kills / player.stats.deaths).toFixed(2) : player.stats.kills.toFixed(2),
        acs: Math.round(player.stats.score / (blue + red)),
        score: `${ownScore} – ${enemyScore}`,
        win,
        mode,
        isRanked,
        rank,
        mmrChange,
        matchDuration: matchDurationMinutes,
        isTeamMVP: isTeamMVP,
        isMatchMVP: isMatchMVP,
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
        .setTitle(`${result.score}${result.isMatchMVP ? '   •    👑 Match MVP' : result.isTeamMVP ? '   •   🏆 Team MVP' : ''}`)
        .addFields(
        { name: "🗺️  Map", value: result.map, inline: true },
        { name: "🎮  Modus", value: result.mode, inline: true },
        { name: "📊  KD", value: `${result.kd}`, inline: true },

        { name: "⚔️  K / D / A", value: `${result.kills} / ${result.deaths} / ${result.assists}`, inline: true },
        { name: "🎯  HS%", value: `${result.headshotPercent}%`, inline: true },
        { name: "💰  ACS", value: `${result.acs}`, inline: true })
        .setThumbnail(result.agentIcon)
        .setImage(result.mapImage)
        .setFooter({ text: `${result.playerName}#${result.playerTag} • Match ID: ${result.matchId}` })

    // Bei Ranked Matches
    if (result.isRanked) {
        embed.addFields(
            { name: "💎 Rank", value: result.rank || "Unranked", inline: true },
            { name: "📈 RR", value: `${result.mmrChange > 0 ? '+' : ''}${result.mmrChange || 0}`, inline: true },
            { name: "⏱️ Dauer", value: `${result.matchDuration} Min`, inline: true }
        )
    }
    
    channel.send({ embeds: [embed] });
}




async function loadMapData() {
    try {
        const response = await axios.get("https://valorant-api.com/v1/maps");
        response.data.data.forEach(map => {
            mapCache[map.displayName] = map.listViewIcon;
        });
        console.log("✅ Maps geladen:", Object.keys(mapCache).length);
    } catch (err) {
        console.log("❌ Map-Daten Fehler:", err.message);
    }
}

// ← NEU: Funktion zum Holen der MMR/RR Daten
async function getMMRData(region, puuid) {
    try {
        const response = await axios.get(`https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr-history/${region}/${puuid}`, {
            headers: { Authorization: process.env.HENRIK_API_KEY }
        });
        
        // Neueste MMR-Änderung (erstes Element im Array)
        const latestGame = response.data.data[0];
        
        return {
            mmrChange: latestGame?.mmr_change_to_last_game || 0,
            currentMMR: latestGame?.elo || 0,
            rankingInTier: latestGame?.ranking_in_tier || 0
        };
    } catch (err) {
        console.log("❌ MMR-Daten Fehler:", err.message);
        return { mmrChange: 0, currentMMR: 0, rankingInTier: 0 }; // Fallback
    }
}