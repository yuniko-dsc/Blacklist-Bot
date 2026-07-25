const { SlashCommandBuilder, Client, Message, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    name: "owners",
    description: "Affiche la liste des owners.",
    aliases: [],
    permissions: ["ViewChannel"],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    botBuyerOnly: true,
    hide: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    async execute(client, message, args) {
        const owners = client.config.owners || [];
        let page = 0;

        const buildEmbed = () => {
            const start = page * 10;
            const end = start + 10;
            const slice = owners.slice(start, end);
            return new EmbedBuilder()
                .setTitle("Liste des owners")
                .setColor(0xff0000)
                .setDescription(slice.length ? slice.map((id, i) => `\`${start + i + 1}\` - <@${id}>`).join("\n") : "Aucun owner");
        };

        const embed = buildEmbed();
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("back").setLabel("◀").setStyle(2),
            new ButtonBuilder().setCustomId("next").setLabel("▶").setStyle(2)
        );

        const msg = await message.channel.send({ embeds: [embed], components: owners.length > 10 ? [row] : [] });
        const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 600000 });

        collector.on("collect", async i => {
            i.deferUpdate();
            if (i.customId === "back" && page > 0) page--;
            if (i.customId === "next" && (page + 1) * 10 < owners.length) page++;
            const updatedEmbed = buildEmbed();
            msg.edit({ embeds: [updatedEmbed] });
        });

        collector.on("end", () => msg.edit({ components: [] }).catch(() => {}));
    },
    /**
     * @param {Client} client
     * @param {Interaction} interaction
    */
    async executeSlash(client, interaction) {
        const owners = client.config.owners || [];
        let page = 0;

        const buildEmbed = () => {
            const start = page * 10;
            const end = start + 10;
            const slice = owners.slice(start, end);
            return new EmbedBuilder()
                .setTitle("Liste des owners")
                .setColor(0xff0000)
                .setDescription(slice.length ? slice.map((id, i) => `\`${start + i + 1}\` - <@${id}>`).join("\n") : "Aucun owner");
        };

        const embed = buildEmbed();
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("back").setLabel("◀").setStyle(2),
            new ButtonBuilder().setCustomId("next").setLabel("▶").setStyle(2)
        );

        const msg = await interaction.reply({ embeds: [embed], components: owners.length > 10 ? [row] : [], fetchReply: true });
        const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 600000 });

        collector.on("collect", async i => {
            i.deferUpdate();
            if (i.customId === "back" && page > 0) page--;
            if (i.customId === "next" && (page + 1) * 10 < owners.length) page++;
            const updatedEmbed = buildEmbed();
            msg.edit({ embeds: [updatedEmbed] });
        });

        collector.on("end", () => msg.edit({ components: [] }).catch(() => {}));
    },
    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);
    }
};
