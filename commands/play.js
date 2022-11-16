const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song from Spotify.")
        .addStringOption(option =>
            option.setName("link-or-query").setDescription("Get url or search term to play the song.").setRequired(true)
        ),
	execute: async ({ client, interaction }) => {
        // Make sure the user is inside a voice channel
		if (!interaction.member.voice.channel) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> You must join a voice channel to play a track!`).setColor(`Red`)] })

        //get the url
		let url = interaction.options.getString("link-or-query")

        // Start playling
        await client.distube.play(interaction.member.voice.channel, url, { interaction, member: interaction.member, textChannel: interaction.channel })

        // Reply success message
        //interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033721502874484746> **[${song.name}](${song.url})** has been added to the Queue.`).setColor(`Green`)] })
	},
}
