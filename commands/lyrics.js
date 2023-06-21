const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const lyricSearcher = require('lyrics-searcher-musixmatch').default;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("The lyric of the current song"),
	execute: async ({ client, interaction }) => {
		// defer Reply (because lyrics need more time to fetch)
		await interaction.deferReply();
		
        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // Check if the queue is empty
		if (!queue || !queue.isPlaying()) {
            await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
            return;
        }

		const currentSong = queue.currentTrack;
        
        // Get the current song lyrics
		lyricSearcher(`${currentSong.title}`).then((bodylyrics) => {
			if (!bodylyrics) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });
			if (!bodylyrics["lyrics"]) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });

			let lyrics = bodylyrics["lyrics"];

			if (lyrics.length >= 1996) {
				let trimmedString = yourString.substr(0, maxLength);
				lyrics = trimmedString + " ...";
			}
	
			interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`${lyrics}`).setColor(`Blue`)] });
		})
	},
}