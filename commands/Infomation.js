const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Get current track infomation"),
	execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue || (!queue.playing && !queue.connection)) {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no songs in the queue!`).setColor(`Red`)] });
            return;
        }
        
        const currentSong = queue.current

        if (currentSong) {
            interaction.reply({ embeds: [new EmbedBuilder().setTitle(currentSong.title).setThumbnail(currentSong.thumbnail).setDescription(`Author: ${currentSong.author}\nDescription: \`${currentSong.description}\`\nUrl: ${currentSong.url}`).setColor(`Blue`)] });
        }
	},
}