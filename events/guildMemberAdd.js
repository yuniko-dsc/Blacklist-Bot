const { Client, GuildMember } = require('discord.js')

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {Client} client
     * @param {GuildMember} member 
    */
    async execute(client, member) {
        if (client.db[member.id])
            return member.ban({ reason: client.db[member.id].reason });
    }
}