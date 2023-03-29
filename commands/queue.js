const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows songs in the list!")
        .addSubcommand(subcommand =>
			subcommand
				.setName("list")
				.setDescription("Shows first 10 songs in the queue.")
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("page")
				.setDescription("Turn to selected page in the queue.")
				.addStringOption(option =>
					option.setName("position").setDescription("Position of page.").setRequired(true)
				)
		),
    execute: async ({ client, interaction }) => {
        if (interaction.options.getSubcommand() === "list") {
            const queue = client.player.nodes.get(interaction.guildId)

            // check if there are songs in the queue
            if (!queue || !queue.isPlaying()) {
                await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
                return;
            }

            // Get the first 10 songs in the queue
            const queueString = queue["tracks"]["data"].slice(0, 10).map((song, i) => {
                return `${i}) [${song.duration}] ${song.title} - <@${song.requestedBy.id}>`
            }).join("\n")

            // Total Page
            let TotalPage = 0;
            
            const pagetotal = queue.tracks.size/10;

            if (((pagetotal - Math.floor(pagetotal)) !== 0) === true) {
                TotalPage = Math.floor(pagetotal) + 1; 
            } else {
                TotalPage = pagetotal;
            }
    
            // Get the current song
            const currentSong = queue.currentTrack;
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`**Currently Playing**\n` + (currentSong ? `[${currentSong.duration}] ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") + `\n\n**Queue**\n${queueString}`).setFooter({text: `1/${TotalPage}`}).setColor(`Green`)] })
        }
        else if (interaction.options.getSubcommand() === "page") {
            const queue = client.player.nodes.get(interaction.guildId)

            // check if there are songs in the queue
            if (!queue || !queue.isPlaying()) {
                await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
                return;
            }
    
            // Get the first 10 songs in the queue
            if (!Number(interaction.options.getString("position"))) return;
            const queueString = queue["tracks"]["data"].slice(((Number(interaction.options.getString("position")) - 1) * 10), ((Number(interaction.options.getString("position")) - 1) * 10) + 10).map((song, i) => {
                return `${i + ((Number(interaction.options.getString("position")) - 1) * 10)}) [${song.duration}] ${song.title} - <@${song.requestedBy.id}>`
            }).join("\n")

            // Total Page
            let TotalPage = 0;

            const pagetotal = queue.tracks.size/10;

            if (((pagetotal - Math.floor(pagetotal)) !== 0) === true) {
                TotalPage = Math.floor(pagetotal) + 1; 
            } else {
                TotalPage = pagetotal;
            }
    
            // Get the current song
            const currentSong = queue.currentTrack;
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`**Currently Playing**\n` + (currentSong ? `[${currentSong.duration}] ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") + `\n\n**Queue**\n${queueString}`).setFooter({text: `Page: ${Number(interaction.options.getString("position"))}/${TotalPage}`}).setColor(`Green`)] })
        }
    }
}