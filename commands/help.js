const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
        data: new SlashCommandBuilder().setName("help").setDescription("Show the help info and commands!"),
        execute: async ({ client, interaction }) => {
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Support Server: https://Dispify.vercel.app/invite/\nHelp page: https://github.com/codernocook/Dispify/wiki/\nVersion: 3.0.0`).setColor(`Blue`)] })
        },
}