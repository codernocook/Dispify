const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song")
        .addSubcommand(subcommand =>
			subcommand
				.setName("first")
				.setDescription("Skip to next song.")
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("number")
				.setDescription("Skip to track position.")
				.addStringOption(option => option.setName("number").setDescription("Skip to track position.").setRequired(true))
		),
	execute: async ({ client, interaction }) => {
        // Get the queue for the server
		const queue = client.player.nodes.get(interaction.guildId)

        // If there is no queue, return
		if (!queue || !queue.isPlaying()) {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> There are no song in the queue!`).setColor(`Red`)] })
            return;
        }

        const currentSong = queue.currentTrack;

        // Get subCommand of song
        if (interaction.options.getSubcommand() === "number") {
            let position = interaction.options.getString("number");
            const queueSongNumber = queue["tracks"]["data"].map((song, i) => {return i;})

            if (!position) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Invaild Position, please type vaild position.`).setColor(`Red`)] });
            if (!Number(position)) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Invaild Position, please type vaild position.`).setColor(`Red`)] });
            if ((Number(position)) > queueSongNumber) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifyError:1033721529084694598> Invaild Position, please type vaild position.`).setColor(`Red`)] });

            queue.node.skipTo(Number(position));
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Skipped **[${currentSong.title}](${currentSong.url})**.`).setColor(`Green`)] })
		}
        else if (interaction.options.getSubcommand() === "first") {
            // Skip the current song
            queue.node.skip()

            // Return an embed to the user saying the song has been skipped
            // Checking if this is the last song in the queue
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:DispifySuccess:1033721502874484746> Skipped **[${currentSong.title}](${currentSong.url})**.`).setColor(`Green`)] })
        }
	},
}