const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue)
        {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
            return;
        }

        // Pause the current song
		queue.setPaused(false);

        await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033721502874484746> Player has been resumed!`).setColor(`Green`)] })
	},
}
