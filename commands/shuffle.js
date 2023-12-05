const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("shuffle")
		.setDescription("Shuffles the track in the queue."),
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
        
        // Shuffle
        try {
            if (queue && queue["tracks"] && queue["tracks"]["shuffle"]) {
                queue.tracks.shuffle();
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Queue shuffled successfully.`).setColor(`Green`)]
                });
            } else {
                interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Unable to shuffle the queue. Please try again.`).setColor(`Red`)]
                });
            }
        } catch {
            interaction.editReply({
                embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Unable to shuffle the queue. Please try again.`).setColor(`Red`)]
            });
        }
	},
}