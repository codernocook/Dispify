const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // Check if the queue is empty
		if (!queue) {
            await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
            return;
        }
        
        // Check if the request is vaild
        if (!queue.node.isPaused()) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> The queue is playing you can't resume it.`).setColor(`Red`)] })

        // Pause the current song
		queue.node.resume();

        await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Player has been resumed!`).setColor(`Green`)] })
	},
}