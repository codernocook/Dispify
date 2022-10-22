const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Kick the bot from the channel."),
	execute: async ({ client, interaction }) => {

        // Get the current queue
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue)
		{
			await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`There no song in the queue!`).setColor(`Red`)] })
			return;
		}

        // Deletes all the songs from the queue and exits the channel
		queue.destroy();

        await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`Left channel!`).setColor(`Green`)] })
	},
}
