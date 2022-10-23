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
				.setName("playlist")
				.setDescription("Play a playlist from Spotify.")
				.addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("song")
				.setDescription("Play a song from Spotify.")
				.addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033601680387887125> You must join a voice channel to play a track!`).setColor(`Red`)] })

        // Create a play queue for the server
		const queue = await client.player.createQueue(interaction.guild);

        // Wait until you are connected to the channel
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            
            // Search for the song using the discord-player
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_SONG
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033601680387887125> There are no result for the selected song.`).setColor(`Red`)] })

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033601653749862491> **[${song.title}](${song.url})** has been added to the Queue`).setColor(`Green`)] })

		}
        else if (interaction.options.getSubcommand() === "playlist") {

            // Search for the playlist using the discord-player
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.SPOTIFY_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.reply(`No playlists found with ${url}`)
            
            // Add the tracks to the queue
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033601653749862491> **${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`).setColor(`Green`)] })

		} 
        else if (interaction.options.getSubcommand() === "search") {

            // Search for the song using the discord-player
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033601680387887125> Sorry, No result was found!`).setColor(`Red`)] })
            
            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033601653749862491> **[${song.title}](${song.url})** has been added to the Queue`).setColor(`Green`)] })
		}

        // Play the song
        if (!queue.playing) await queue.play();
	},
}
