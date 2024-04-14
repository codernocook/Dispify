const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

// Result array
const resultArr = [
    {
        "queryType": QueryType.SPOTIFY_PLAYLIST,
        "streamingPlatform": "spotify",
        "type": "playlist",
    },
    {
        "queryType": QueryType.SPOTIFY_ALBUM,
        "streamingPlatform": "spotify",
        "type": "playlist",
    },
    {
        "queryType": QueryType.YOUTUBE_PLAYLIST,
        "streamingPlatform": "youtube",
        "type": "playlist",
    },
    {
        "queryType": QueryType.SOUNDCLOUD_PLAYLIST,
        "streamingPlatform": "soundcloud",
        "type": "playlist",
    },
    {
        "queryType": QueryType.AUTO,
        "streamingPlatform": "track",
        "type": "track",
    }
]

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song from Spotify.")
		.addStringOption(option => option.setName("url").setDescription("Search or a track/playlist/album.").setRequired(true)),
	execute: async ({ client, interaction }) => {
        // Defer reply to prevent many command make bot crash
        await interaction.deferReply();

        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> You must join a voice channel to play a track!`).setColor(`Red`)] });

		// Search for the song using the discord-player
        let url_data = interaction.options.getString("url");

        // Get the songs on the Spotify, Youtube, Soundcloud by checking
        for (let checking_index = 0; checking_index < 5; checking_index++) {
            const result = await client.player.search(url_data, {
                requestedBy: interaction.user,
                searchEngine: ((resultArr[checking_index]["queryType"] || "spotify") || QueryType.AUTO)
            })

            // Make sure the checking index is not the type "AUTO"
            if (checking_index !== 4) {
                if (result["playlist"]) {
                    // Send request
                    playSong(url_data, result, (resultArr[checking_index]["type"] || "playlist"), (resultArr[checking_index]["streamingPlatform"] || "spotify"));

                    // Break the loop
                    break;
                }
            } else {
                // "AUTO" type, for searching
                // Send request
                playSong(url_data, result, (resultArr[checking_index]["type"] || "playlist"), (resultArr[checking_index]["streamingPlatform"] || "spotify"));

                // Break the loop
                break;
            }
        }

        async function playSong(url, result, resulttype, playlisttype) {
            if (resulttype === "track") {
                //Check if wrong type of result spam error
                if (!url) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Missing url option.`).setColor(`Red`)] });
                if (!result) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
                if (!result["tracks"]) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
                if (result === undefined) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
                if (!result["tracks"][0]) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no result for the selected song.`).setColor(`Red`)] });
                // finish if no tracks were found
                if (!result.hasTracks()) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Sorry, No result was found!`).setColor(`Red`)] })
                
                // Play the track to the queue
                const song = await client.player.play(interaction.member.voice.channel.id, result, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            looped: false,
                            loopMode: null,
                            client: client,
                            requestedBy: interaction.user,
                            filter: new Set(),
                            leaveOnStop: false,
                            leaveOnEmpty: true,
                            leaveOnEmptyCoolDown: 3000000,
                            leaveOnEnd: true,
                            leaveOnEndCoolDown: 3000000,
                            pauseOnEmpty: true,
                            preferBridgedMetadata: true
                        },
                        volume: 100
                    }
                })

                // Reply the message
                interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> **[${result["tracks"][0]["title"]}](${result["tracks"][0]["url"]})** has been added to the Queue.`).setColor(`Green`)] });
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
                            looped: false,
                            loopMode: null,
                            client: client,
                            requestedBy: interaction.user,
                            filter: new Set(),
                            leaveOnStop: false,
                            leaveOnEmpty: true,
                            leaveOnEmptyCoolDown: 3000000,
                            leaveOnEnd: true,
                            leaveOnEndCoolDown: 3000000,
                            pauseOnEmpty: true,
                            preferBridgedMetadata: true
                        },
                        volume: 100
                    }
                })

                // Reply the message
                interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> **${result["tracks"]["length"]} songs from [${playlist["title"]}](${playlist["url"]})** have been added to the Queue`).setColor(`Green`)] });
            }
        }
	},
}
