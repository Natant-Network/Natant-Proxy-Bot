const { Message, SlashCommandBuilder, GuildDefaultMessageNotifications } = require('discord.js');
const { email, password } = require('../config.json');
// const Keyv = require('keyv');
// const { host, user, password, datab } = require('../config.json');
const PocketBase = require('pocketbase/cjs')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-started')
		.setDescription('Set up your server for the first time.'),
	async execute(interaction, args) {
		let roles = '';
		let guildID = interaction.guild.id;
		let dinvv = '';
		let usesv = '';
		//get user id
		let userID = interaction.user.id;
		// console.log(guildID);
		async function pocketbasstart() {
			const client = new PocketBase('http://127.0.0.1:8090');
			const authData = await client.admins.authViaEmail(`${email}`, `${password}`);
			// const resultList = await client.records.getList('demo', 1, 50, {
			//     filter: 'created >= "2022-01-01 00:00:00"',
			// });
			const newRecord = await client.records.create('guilds', {
				guildID: guildID,
				roleIDs: roles,
				premium: 'yes',
				invite: dinvv,
				usesallowed: usesv,
			});
			const newUser = await client.records.create('users', {
				iduser: userID,
				idguild: guildID,
				numberofuses: 0,
			});
		}
		async function setuses() {
			const filter = m => m.author.id == interaction.user.id;
			const collector = interaction.channel.createMessageCollector({ filter, time: 15000, errors: ['time'] });
			collector.on('collect', async (m) => {
				// check if the message has a number between 1 and 100
				if (m.content >= 1 && m.content <= 100) {
				usesv = m.content;
				// console.log(roles);
				await interaction.followUp({ content: `Thanks! For your input the amount of uses you choose was: ${m.content} this can be changed later` });
				collector.stop('done');
				} else {
					// await interaction.followUp({ content: `That's not a valid invite!` });
					collector.stop('invalid');
				}
			});
			collector.on('end', async (collected, reason) => {
				//console.log(`Collected ${collected.size} items. For reason: ${reason}`);
				if (reason == 'time') {
					interaction.followUp({ content: 'You did not respond in time! Please re run this command to try again.' });
				}
				else if (reason == 'invalid') {
					await interaction.followUp({ content: 'Please use a number 1 - 100' });
				}
				else {
					// console.log(`Collected ${collected.size} items. For reason: ${reason}`);
					// pocketbasstart();
					await interaction.followUp({ content: 'Thanks for setting me up please wait while i add this to my database!' });
					// setuses();
					pocketbasstart();
				}
			});
		}
		async function dinv() {
			const filter = m => m.author.id == interaction.user.id;
			const collector = interaction.channel.createMessageCollector({ filter, time: 15000, errors: ['time'] });
			collector.on('collect', async (m) => {
				// check if the message is a valid discord invite
				if (m.content.includes('https://discord.gg/')) {
				//console.log(m.content);
				dinvv = m.content;
				// console.log(roles);
				await interaction.followUp({ content: `Thanks! For your input the link you chose to use was: ${m.content}` });
				collector.stop('done');
				} else {
					// await interaction.followUp({ content: `That's not a valid invite!` });
					collector.stop('invalid');
				}
			});
			collector.on('end', async (collected, reason) => {
				//console.log(`Collected ${collected.size} items. For reason: ${reason}`);
				if (reason == 'time') {
					interaction.followUp({ content: 'You did not respond in time! Please re run this command to try again.' });
				}
				else if (reason == 'invalid') {
					await interaction.followUp({ content: 'Please use a valid discord invite (https://discord.gg/)' });
				}
				else {
					// console.log(`Collected ${collected.size} items. For reason: ${reason}`);
					// pocketbasstart();
					interaction.followUp({ content: 'Next Up How many links would you like one user to get? (e.g 3 links per month)' });
					setuses();
					// pocketbasstart();
				}
			});
		} 
		// interaction collector 
		await interaction.reply({ content: 'Welcome to the setup process! To get started ping what role(s) you want to run the /reset command (To select multiple roles simply ping both seperated by a space e.g @EASY @YES) (Timeout 30 sec)'});
		//interaction collector
		const filter = m => m.author.id == interaction.user.id;
		const collector = interaction.channel.createMessageCollector({ filter, time: 15000, errors: ['time'] });
		collector.on('collect', async (m) => {
			if (m.content !== '<@&' + m.content.slice(3, -1) + '>') {
				return collector.stop('invalid');
			}
			console.log(m.content);
			roles = m.content;
			console.log(roles);
			await interaction.followUp({ content: `Thanks! For your input you role(s) you selected were: ${m.content}` });
			collector.stop('done');
		}
		)
		collector.on('end', async (collected, reason) => {
			//console.log(`Collected ${collected.size} items. For reason: ${reason}`);
			if (reason == 'time') {
				interaction.followUp({ content: 'You did not respond in time! Please re run this command to try again.' });
			}
			else if (reason == 'invalid') {
				await interaction.followUp({ content: 'Please ping a role! Please re-try by re-running this command!' });
			}
			else {
				// console.log(`Collected ${collected.size} items. For reason: ${reason}`);
				// pocketbasstart();
				interaction.followUp({ content: 'Continuing on, what is the invite link to your discord server? (This will be premium only at some point)' });
				dinv();
			}
		});
	}
};
