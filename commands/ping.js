const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
        data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Show the help info and commands!"),
        execute: async ({ client, interaction }) => {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription("Pong! " + `${toString(client.ws.ping)}`).setColor(`Blue`)] })
        },
}
