const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("Make the bot leave current voice channel."),
	execute: async ({ client, interaction }) => {
		// Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to do this action.`).setColor(`Red`)] });
		
		// Get the current queue
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) {
			await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
			return;
		}

		// use delete() function to delete the queue
		queue.delete();

		await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Left channel!`).setColor(`Green`)] })
	},
}