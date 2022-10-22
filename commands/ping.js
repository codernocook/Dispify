const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
	execute: async ({ client, interaction }) => {
        message.reply({ embeds: [new EmbedBuilder().setDescription(`Pong! 0ms`).setColor(`Green`)] }).then(messageget => {
            const ping = messageget.createdTimestamp - message.createdTimestamp;
            messageget.editReply({ embeds: [new EmbedBuilder().setDescription(`Pong! ${ping}ms`).setColor(`Green`)] })
        })
	},
}
