const voice = require("../../../Structures/Systems/AlwaysInVoice/voiceUtil");

module.exports = {
  name: "shardDisconnect",
  async execute(event, shardID, client) {
    console.warn(`⚠️ Voice-Disconnect auf Shard ${shardID}`);
    const guild = client.guilds.cache.get("596787251959037965");
    if (guild) voice.reconnectIfNeeded(guild);
  }
};
