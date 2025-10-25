const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");
const path = require("path");

let connection;
let player;

module.exports = {
  /**
   * Betritt einen Voice-Channel und spielt stille Audio-Datei in Dauerschleife.
   */
  async joinAndStay(channel) {
    if (!channel || !channel.joinable) return console.log("❌ Channel nicht joinbar");

    // Verbindung aufbauen
    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    player = createAudioPlayer();

    const resourcePath = path.join(__dirname, "fs.mp3");
    const resource = createAudioResource(resourcePath);
    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      // Endlosschleife
      player.play(createAudioResource(resourcePath));
    });

    console.log(`🎧 Bot ist nun dauerhaft in: ${channel.name}`);
  },

  /**
   * Rejoin, falls Verbindung verloren geht
   */
  reconnectIfNeeded(guild) {
    if (!connection || connection.state.status === "destroyed") {
      console.log("♻️ Voice-Connection verloren, versuche Reconnect...");
      const targetChannelId = process.env.VOICE_CHANNEL_ID;
      const channel = guild.channels.cache.get(targetChannelId);
      if (channel) this.joinAndStay(channel);
    }
  }
};