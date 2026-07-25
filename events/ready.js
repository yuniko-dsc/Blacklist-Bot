const { Routes, Client, ActivityType, Events } = require('discord.js');
const { REST } = require('@discordjs/rest');

function applyPresence(client) {
    const presenceConfig = client.config?.presence || {};
    const status = presenceConfig.status || "online";
    const activities = Array.isArray(presenceConfig.activities) && presenceConfig.activities.length
        ? presenceConfig.activities
        : [{ name: "Blacklist Bot", type: ActivityType.Streaming, url: "https://www.twitch.tv/002sans" }];

    const [activity] = activities;
    if (!activity) {
        client.user.setPresence({ status });
        return;
    }

    const typeMap = {
        playing: ActivityType.Playing,
        streaming: ActivityType.Streaming,
        watching: ActivityType.Watching,
        listening: ActivityType.Listening,
        competing: ActivityType.Competing
    };

    const normalizedType = typeof activity.type === "string"
        ? typeMap[activity.type.toLowerCase()] ?? ActivityType.Playing
        : activity.type ?? ActivityType.Playing;

    const activityOptions = {
        name: activity.name || "Blacklist Bot",
        type: normalizedType,
        ...(activity.url ? { url: activity.url } : {})
    };

    client.user.setPresence({ activities: [activityOptions], status });
}

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
    */
    async execute(client) {
        console.log(`[READY] ${client.user.tag} (${client.user.id}) est prêt | ${client.guilds.cache.size.toLocaleString('fr-FR')} serveurs | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString('fr-FR')} utilisateurs`);
        applyPresence(client);

        const rest = new REST({ version: '10' }).setToken(client.token);

        rest.put(
            Routes.applicationCommands(client.user.id), { body: client.config.slashs ? client.commands.map(r => r.data.toJSON()) : [] }
        )
            .then((data) => console.log(`[SLASH] ${data.length} commandes enregistrees.`))
            .catch(console.error);
    }
}