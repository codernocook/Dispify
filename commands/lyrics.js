const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const maxLength = 1996;

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("The lyrics of the current song"),
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

		// Getting searches
		const songSearches = await client.geniusClient.search(`${currentSong["author"]} - ${currentSong["title"]}`);

		// Getting first song
		const firstSong = songSearches[0];

		// Getting the lyrics
		const lyrics = await firstSong.lyrics();

		// Checking if lyrics existed
		if (!lyrics) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });
		if (typeof(songSearches) !== "object" && Array.isArray(songSearches) === false) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });
		if (!songSearches[0] || !firstSong) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });
		if ((lyrics || "")?.toString().length <= 0) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`Not found.`).setColor(`Blue`)] });

		if (lyrics.length > (maxLength + 4)) {
			let trimmedString = yourString.substr(0, maxLength);
			lyrics = trimmedString + " ...";
		}
	
		interaction.editReply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`${lyrics}`).setColor(`Blue`)] });
	},
}
