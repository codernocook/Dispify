const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
        data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
        execute: async ({ client, interaction }) => {
                interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Pong! **${client.ws.ping}ms**`).setColor(`Green`)] })
        },
}