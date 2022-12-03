const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const { Lyrics } = require("@discord-player/extractor");
const lyricsClient = Lyrics.init(process.env.SpotifyAPIKey);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lyrics")
		.setDescription("Get lyrics from the current song."),
	execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue)
        {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
            return;
        }
        const currentSong = queue.current;

        if (currentSong) {
            lyricsClient.search(currentSong.url).then(infoget => {
                // Check if the playlist is invaild
                if (!infoget || !infoget["title"] || !infoget["thumbnail"] || !infoget["lyrics"]) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> This command is not working right now!`).setColor(`Red`)] })
                // Reply the infomation
                interaction.reply({ embeds: [new EmbedBuilder().setTitle(infoget.title).setThumbnail(infoget.thumbnail).setDescription(infoget.lyrics).setColor(`Blue`)] })
            })
        }
	},
}