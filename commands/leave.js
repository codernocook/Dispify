const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Make the bot leave current voice channel."),
	execute: async ({ client, interaction }) => {

        // Get the current queue
		const queue = client.distube.getQueue(interaction)

		if (!queue) {
			await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There no song in the queue!`).setColor(`Red`)] })
			return;
		}

        // Start leaving
		client.distube.voices.leave(message)
        await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033721502874484746> Left channel!`).setColor(`Green`)] })
	},
}
