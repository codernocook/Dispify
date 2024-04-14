const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueueRepeatMode } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leaveonend")
		.setDescription("Make the bot leave/stay in the channel as soon as the queue ends")
        .addSubcommand(subcommand =>
            subcommand
                .setName("on")
                .setDescription("Make the bot leave channel as soon as the queue ends")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("off")
                .setDescription("Make the bot stay in the channel as soon as the queue ends")
        ),
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
        
        // Loop
        if (interaction.options.getSubcommand() === "on") {
            if (queue["metadata"]["leaveOnEnd"] !== true) {
                // Set leaveOnEnd to true
                queue["metadata"]["leaveOnEnd"] = true;

                // Send success message
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Bot will remain in channel after queue completion.`).setColor(`Green`)]
                });
            } else {
                // Send success message
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Leave on end already turned on.`).setColor(`Green`)]
                });
            }
        } else if (interaction.options.getSubcommand() === "off") {
            if (queue["metadata"]["leaveOnEnd"] !== false) {
                // Set leaveOnEnd to true
                queue["metadata"]["leaveOnEnd"] = false;

                // Send success message
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Bot won't remain in channel after queue completion.`).setColor(`Green`)]
                });
            } else {
                // Send success message
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Leave on end already turned off.`).setColor(`Green`)]
                });
            }
        }
	},
}
