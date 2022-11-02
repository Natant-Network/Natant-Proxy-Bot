const { Message, SlashCommandBuilder } = require('discord.js');
// const Keyv = require('keyv');
// const { host, user, password, datab } = require('../config.json');
const PocketBase = require('pocketbase/cjs')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-started')
		.setDescription('Set up your server for the first time.'),
	async execute(interaction, args) {
		const client = new PocketBase('http://127.0.0.1:8090');
		// list and search for 'demo' collection records
		// fetch a paginated records list
		const resultList = await client.records.getList('demo', 1, 50, {
		    filter: 'created >= "2022-01-01 00:00:00"',
		});	
		// interaction collector 
		await interaction.reply({ content: 'Welcome to the setup process! To get started enter what role(s) you want to run the /reset command (Time out 30 sec)'});
		//interaction collector
		const filter = m => m.author.id == interaction.user.id;
		const collector = interaction.channel.createMessageCollector({ filter, max: 1, setTimeout: 30000 });
		collector.on('collect', async (m) => {
			console.log(m.content);
			await interaction.followUp({ content: `Thanks! For your input you role(s) you selected were: ${m.content}` });
		}
		);
		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items.`);
		});
	}
};
