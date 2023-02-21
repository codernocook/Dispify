const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song from Spotify.")
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
				.setName("track")
				.setDescription("Play a track/playlist/album from Spotify.")
				.addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to play a track!`).setColor(`Red`)] })

        // Create a play queue for the server
		const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction,
            leaveOnEmptyCooldown: 60 * 1000,
        });

        // Wait until you are connected to the channel
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		if (interaction.options.getSubcommand() === "track") {
            let url = interaction.options.getString("url");
            
            // Search for the song using the discord-player
            try {
                const checkresult = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_SONG
                })
                await runsc("track", checkresult);
            } catch {
                try {
                    const checkresult = await client.player.search(url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.SPOTIFY_PLAYLIST
                    })
                    await runsc("playlist", checkresult);
                } catch {
                    const checkresult = await client.player.search(url, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.SPOTIFY_ALBUM
                    })
                    await runsc("album", checkresult);
                }
            }
	    
            async function runsc(resulttype, result) {
                if (resulttype === "track") {
                    //Check if wrong type of result spam error
                    if (url === undefined || url === null) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Missing url option.`).setColor(`Red`)] });
                    if (!url) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Missing url option.`).setColor(`Red`)] });
                    if (!result) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
                    if (result === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
    
                    // finish if no tracks were found
                    if (result.tracks.length === 0)
                        return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] })
    
                    // Add the track to the queue
                    const song = result.tracks[0]
                    await queue.addTrack(song)
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> **[${song.title}](${song.url})** has been added to the Queue.`).setColor(`Green`)] })
                } else if (resulttype === "playlist") {
                    const playlist = result.playlist;
                    if (!url) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                    if (!result) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                    if (result === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
    
                    if (result.tracks.length === 0) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                    
                    // Add the tracks to the queue
                    
                    // Over Playlist Reject
                    if (result.tracks.length > 100) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Playlist too long, Dispify can't process.`).setColor(`Red`)] })
                    // Add tracks to playlist
                    await queue.addTracks(result.tracks)
    
                    //Reply the message
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> **${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`).setColor(`Green`)] })
                } else if (resulttype === "album") {
                    const playlist = result.playlist;
                    if (!url) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No album found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                    if (!result) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No album found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                    if (result === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No album found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
    
                    if (result.tracks.length === 0) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No album found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                    
                    // Add the tracks to the queue

                    // Over Playlist Reject
                    if (result.tracks.length > 100) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Album too long, Dispify can't process.`).setColor(`Red`)] })
                    // Add tracks to playlist
                    await queue.addTracks(result.tracks)
    
                    //Reply the message
                    interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> **${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`).setColor(`Green`)] })
                }
            }
		} else if (interaction.options.getSubcommand() === "search") {
            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms");
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            //Check if wrong type of result spam error
            if (!url) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Missing url option.`).setColor(`Red`)] });
            if (!result) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
            if (result === undefined) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });

            // finish if no tracks were found
            if (result.tracks.length === 0) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Sorry, No result was found!`).setColor(`Red`)] })
            
            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> **[${song.title}](${song.url})** has been added to the Queue.`).setColor(`Green`)] })
		}

        // Play the song
        if (!queue.playing) await queue.play();
	},
}