const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const lyricsFinder = require('lyrics-finder');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("The lyric of the current song"),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.getQueue(interaction.guildId)
        const currentSong = queue.current

        // Check if the queue is empty
		if (!queue)
		{
			await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Green`)] })
			return;
		}
        
        // Get the current song lyrics
		let lyrics = await lyricsFinder(currentSong.author, currentSong.title) || "Not Found!";

        if (lyrics.length >= 1996) {
            let trimmedString = yourString.substr(0, maxLength);
            lyrics = trimmedString + " ...";
        }

        await interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Lyrics of "${currentSong.title}"`).setDescription(`${lyrics}`).setColor(`Blue`)] });
	},
}
