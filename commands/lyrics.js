const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const MusixMatchApi = "https://api.musixmatch.com/ws/1.1/"
const lastrequesturl = "&page_size=3&page=1&s_track_rating=desc"

module.exports = {
	data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Get song lyric provided by MusixMatch."),
	execute: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing) {
            await interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> There are no songs in the queue!`).setColor(`Red`)] });
            return;
        }
        const Http = new XMLHttpRequest();
        Http.open("GET", MusixMatchApi + "track.search?" + `q_track=${queue.current.title}` + "q_artist=" + `${queue.current.author}` + lastrequesturl);
        Http.send();

        Http.onreadystatechange = (e) => {
            interaction.reply({ embeds: [new EmbedBuilder().setDescription(`${Http.responseText}`).setColor(`Green`)] }).catch(err => {message.channel.send({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> Can't get lyrics on MusixMatch.`).setColor(`Red`)] })})
        }
    },
}