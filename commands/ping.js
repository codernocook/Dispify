const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
	execute: async ({ client, interaction }) => {
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Pong! 0ms`).setColor(`Green`)] }).then(interactionget => {
            const ping = interactionget.createdTimestamp - interaction.createdTimestamp;
            interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Pong! ${ping}ms`).setColor(`Green`)] })
        })
	},
}
