const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Get current track infomation"),
	execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId)

        if (!queue || !queue.isPlaying()) {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
            return;
        }
        
        const currentSong = queue.currentTrack;

        if (currentSong) {
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(currentSong.title).setThumbnail(currentSong.thumbnail).setDescription(`Author: ${currentSong.author}\nDescription: \`${currentSong.description}\`\nUrl: ${currentSong.url}`).setColor(`Blue`)] });
        }
	},
}