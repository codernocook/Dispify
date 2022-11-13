const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song or a playlist from Spotify.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song and plays it.")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("url")
				.setDescription("Play a song or playlist with url from Spotify.")
				.addStringOption(option =>
					option.setName("searchterms").setDescription("search keywords").setRequired(true)
				)
		),
	execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
        if (interaction.options.getSubcommand() === "url") {
            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url")
            let playlisttrack = false;
            let songtrack = false;

            const resultsong = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            })
            
            const resultplaylist = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST
            })
            // Check all result if it not found
            if (resultsong.tracks.length === 0 && resultplaylist.tracks.length === 0)  return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no result for the url requested.`).setColor(`Red`)] })
            // Check all result to make it not count as a playlist
            if (resultsong.tracks.length === 0) {
                songtrack = false;
            } else{
                songtrack = true;
            }

            if (resultplaylist.tracks.length === 0) {
                playlisttrack = false;
            } else{
                playlisttrack = true;
            }

            // Playlist Check

            //Check if wrong type of result spam error
            if (!url) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> Missing url option.`).setColor(`Red`)] });
            if (!resultplaylist || !resultsong) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no result for the selected song or selected playlist.`).setColor(`Red`)] });
            if (resultplaylist === undefined || resultsong === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no result for the selected song or selected playlist.`).setColor(`Red`)] });
            
            // Add the tracks to the queue
            if (songtrack == false) {
                if (resultplaylist.tracks.length === 0) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                const playlist = resultplaylist.playlist
                await queue.addTracks(resultplaylist.tracks)
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033721502874484746> **${resultplaylist.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`).setColor(`Green`)] })
           }

            // Song Check

            // Add the track to the queue
            const song = resultsong.tracks[0]
            await queue.addTrack(song)
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033721502874484746> **[${song.title}](${song.url})** has been added to the Queue.`).setColor(`Green`)] })
            if (playlisttrack == false) {
                if (resultsong.tracks.length === 0)  return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] })
                const song = resultsong.tracks[0]
                await queue.addTrack(song)
                interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033721502874484746> **[${song.title}](${song.url})** has been added to the Queue.`).setColor(`Green`)] })
           }
		} 
        else if (interaction.options.getSubcommand() === "search") {

            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            //Check if wrong type of result spam error
            if (!url) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> Missing url option.`).setColor(`Red`)] });
            if (!result) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
            if (result === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> Sorry, No result was found!`).setColor(`Red`)] })
            
            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033721502874484746> **[${song.title}](${song.url})** has been added to the Queue`).setColor(`Green`)] })
		}
        
        // Play the song
        if (!queue.playing) await queue.play();
	},
}
