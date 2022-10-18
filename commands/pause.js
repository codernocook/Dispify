const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`There are no song in the queue!`).setColor(`Green`)] })
			return;
		}

        // Pause the current song
		queue.setPaused(true);

        await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Player has been paused`).setColor(`Green`)] })
	},
}
