const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const lyricSearcher = require('lyrics-searcher-musixmatch').default;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("The lyric of the current song"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)

        // Check if the queue is empty
		if (!queue (!queue.playing && !queue.connection))
		{
			await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Green`)] })
			return;
		}

		const currentSong = queue.current;
        
        // Get the current song lyrics
		lyricSearcher(`${currentSong.author} - ${currentSong.title}`).then((bodylyrics) => {
			if (!bodylyrics) return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });
			if (!bodylyrics["lyrics"]) return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });
			if (bodylyrics.info.track.name.toLowerCase().trim() !== currentSong.title.toLowerCase().trim()) return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });

			let lyrics = bodylyrics["lyrics"];

			if (lyrics.length >= 1996) {
				let trimmedString = yourString.substr(0, maxLength);
				lyrics = trimmedString + " ...";
			}
	
			interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`${lyrics}`).setColor(`Blue`)] });
		})
	},
}