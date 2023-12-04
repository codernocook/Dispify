const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueueRepeatMode, useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loop (on/off) to loop your song")
        .addSubcommand(subcommand =>
            subcommand
                .setName("on")
                .setDescription("Set loop mode to true.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("off")
                .setDescription("Set loop mode to false.")
        ),
	execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to play a track!`).setColor(`Red`)] });

        // Defer reply to prevent many command make bot crash
        await interaction.deferReply();

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
            if (queue && queue["metadata"] && queue["metadata"]["looped"] === false) {
                queue["metadata"]["looped"] = true;
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Set the loop mode to \`on\`.`).setColor(`Green`)]
                });
            } else {
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Cannot set loop mode to \`on\`. Check if the queue is already looping.`).setColor(`Red`)]
                });
            }
        } else if (interaction.options.getSubcommand() === "off") {
            if (queue && queue["metadata"] && queue["metadata"]["looped"] === true) {
                queue["metadata"]["looped"] = false;
                queue.setRepeatMode(QueueRepeatMode.OFF);
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Set the loop mode to \`off\`.`).setColor(`Green`)]
                });
            } else {
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Cannot set loop mode \`off\`. Check if the queue is not looping.`).setColor(`Red`)]
                });
            }
        }
	},
}
