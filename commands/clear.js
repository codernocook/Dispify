const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Clear all tracks in current queue"),
	execute: async ({ client, interaction }) => {
        // Defer reply to prevent many command make bot crash
        await interaction.deferReply();

        // Make sure the user is inside a voice channel
        if (!interaction.member.voice.channel) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to use the command.`).setColor(`Red`)] });

        // Get the current queue
        const queue = client.player.nodes.get(interaction.guildId)

        if (!queue) {
          await interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)]
          })
          return;
        }

        // Clear queue
        queue.clear()
	},
}
