const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { lyricsExtractor } = require("@discord-player/extractor")
require('dotenv').config({path: "../settings.env"});
const lyricsFinder = lyricsExtractor(process.env["geniusAPI"]);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("The lyrics of the current song"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // Check if the queue is empty
		if (!queue || !queue.isPlaying()) {
            await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
            return;
        }

		const currentSong = queue.currentTrack;
        
        // Get the current song lyrics
		lyricsFinder.search(`${currentSong.author} - ${currentSong.title}`).then((bodylyrics) => {
			if (!bodylyrics) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });
			if (!bodylyrics["lyrics"]) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });
			if (bodylyrics.info.track.name.toLowerCase().trim() !== currentSong.title.toLowerCase().trim()) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });

			let lyrics = bodylyrics["lyrics"];

			if (lyrics.length >= 1996) {
				let trimmedString = lyrics.substring(0, 1996);
				lyrics = trimmedString + " ...";
			}
	
			interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`${lyrics}`).setColor(`Blue`)] });
		}).catch(() => {interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found or error.`).setColor(`Blue`)] });})
	},
}