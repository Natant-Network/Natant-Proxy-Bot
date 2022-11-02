const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply({ content: `🏓Latency is ${interaction.createdTimestamp - interaction.createdTimestamp}ms.`, ephemeral: true });
	},
};
