const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { AudioFilters } = require("discord-player");
    
module.exports = {
    data: new SlashCommandBuilder()
	.setName("filter")
	.setDescription("Set/Remove filter to all song in the playlist")
	.addSubcommand(subcommand =>
	    subcommand
	    	.setName("set")
	    	.setDescription("Set a custom filter.")
	    	.addStringOption(option =>
			option.setName("name").setDescription("The filter name.").setRequired(true)
	    	)
	)
	.addSubcommand(subcommand =>
	    subcommand
	    	.setName("clear")
	    	.setDescription("Clear/Remove all filter.")
	),
    execute: async ({ client, interaction }) => {
		// defer Reply (because ffmpeg take so much time to load)
		await interaction.deferReply();

		// Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to do this action.`).setColor(`Red`)] });

		// Get the current queue
		const queue = client.player.nodes.get(interaction.guildId)

		if (!queue) {
			await interaction.editReply({
				embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)]
			})
			return;
		}

		// Add filter
		if (interaction.options.getSubcommand() === "set") {
			let option = interaction.options.getString("name").toLowerCase(); // the option for set command
			try {
				await queue.filters.ffmpeg.toggle([option?.toString()]).then(() => {
					interaction.editReply({
						embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Added filter **${option?.toString()}** to the playlist.`).setColor(`Green`)]
					});
				}).catch(() => {
					interaction.editReply({
						embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Cannot set this filter, make sure the **ffmpeg** filter is vaild.\nDocumentation: https://github.com/codernocook/Dispify/wiki/Filter/`).setColor(`Red`)]
					});
				});
			} catch {
				await interaction.editReply({
					embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Cannot set this filter, make sure the **ffmpeg** filter is vaild.\nDocumentation: https://github.com/codernocook/Dispify/wiki/Filter/`).setColor(`Red`)]
				});
			}
		} else if (interaction.options.getSubcommand() === "clear") {
			try {
				// clear is toggle nothing so this should be blank
				await queue.filters.ffmpeg.toggle([]).catch(() => {
					interaction.editReply({
						embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Successfully removed all filter in the list.`).setColor(`Green`)]
					});
				}).catch(() => {
					interaction.editReply({
						embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Something went wrong, we can't clear the filter list.`).setColor(`Red`)]
					});
				});
			} catch {
				await interaction.editReply({
					embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Something went wrong, we can't clear the filter list.`).setColor(`Red`)]
				});
			}
		}
    },
}