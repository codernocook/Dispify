const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song from Spotify.")
		.addStringOption(option => option.setName("url").setDescription("Search or a track/playlist/album.").setRequired(true)),
	execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to play a track!`).setColor(`Red`)] });

        // Defer reply to prevent many command make bot crash
        await interaction.deferReply();

		// Search for the song using the discord-player
        let url_data = interaction.options.getString("url");
        // Check if the song request is a playlist using try {} catch {} method
        try {
            try {
                const result = await client.player.search(url_data, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_PLAYLIST
                })
                if (result["playlist"]) {
                    runplscript(url_data, result, "playlist", "spotify");
                } else {
                    throw ""; // this trigger catch method
                }
            } catch {
                const result = await client.player.search(url_data, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.SPOTIFY_ALBUM
                })
                if (result["playlist"]) {
                    runplscript(url_data, result, "playlist", "spotify");
                } else {
                    throw ""; // this trigger catch method
                }
            }
        } catch {
            try {
                const result = await client.player.search(url_data, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                if (result["playlist"]) {
                    runplscript(url_data, result, "playlist", "youtube");
                } else {
                    throw ""; // this trigger catch method
                }
            } catch {
                try {
                    const result = await client.player.search(url_data, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.SOUNDCLOUD_PLAYLIST
                    })
                    if (result["playlist"]) {
                        runplscript(url_data, result, "playlist", "soundcloud");
                    } else {
                        throw ""; // this trigger catch method
                    }
                } catch {
                    const result = await client.player.search(url_data, {
                        requestedBy: interaction.user,
                        searchEngine: QueryType.AUTO
                    })
                    runplscript(url_data, result, "track", "track");
                }
            }
        }

        async function runplscript(url, result, resulttype, playlisttype) {
            if (resulttype === "track") {
                //Check if wrong type of result spam error
                if (!url) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Missing url option.`).setColor(`Red`)] });
                if (!result) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
                if  (!result["tracks"]) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
                if (result === undefined) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });

                // finish if no tracks were found
                if (!result.hasTracks()) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Sorry, No result was found!`).setColor(`Red`)] })
                
                // Play the track to the queue
                const song = await client.player.play(interaction.member.voice.channel.id, result, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: client,
                            requestedBy: interaction.user
                        },
                        volume: 100
                    }
                })

                // Reply the message
                interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> **[${song.title}](${song.url})** has been added to the Queue.`).setColor(`Green`)] });
            } else if (resulttype === "playlist") {
                const playlist = result.playlist;

                if (!playlist) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found!`).setColor(`Red`)] })
                if (!url) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                if (!result) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })
                if (result === undefined) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })

                if (!result.hasTracks()) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> No playlist found with **[${playlist.title}](${playlist.url})**`).setColor(`Red`)] })

                // Play and add the playlist to the queue
                const song = await client.player.play(interaction.member.voice.channel.id, result, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: client,
                            requestedBy: interaction.user
                        },
                        volume: 100
                    }
                })

                // Reply the message
                interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> **${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`).setColor(`Green`)] });
            }
        }
	},
}