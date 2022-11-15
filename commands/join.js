const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Make bot join your current voice channel."),
	execute: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) return interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordError:1033721529084694598> You must join a voice channel to make this command work.`).setColor(`Red`)] })
        interaction.reply({ embeds: [new EmbedBuilder().setDescription(`<:SpoticordSuccess:1033721502874484746> Joining ${interaction.member.voice.channel.name}`).setColor(`Green`)] })
        interaction.member.voice.channel.join().catch(err => console.error)
    },
}
