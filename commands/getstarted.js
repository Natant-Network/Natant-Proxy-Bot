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
		let ownerid = interaction.guild.ownerId;
		let userid = interaction.user.id;
		if (ownerid !== userid) {
			return interaction.reply({ content: 'You are not the owner of this server!', ephemeral: true });
		}
		// ROLES later this gets populated with the roles allowed for /reset-users
		let roles = '';
		// Get the Guild ID
		let guildID = interaction.guild.id;
        // Discord Invite this wil be later populated with the invite link
		let dinvv = '';
		// Amount of uses a user can use /proxy before they cannot access more links (per month) this will be later populated.
		let usesv = '';
		//get user id
		let userID = interaction.user.id;
		// GET POCKETBASE DATA TO SEE IF GUILD ALREADY EXISTS
		const client = new PocketBase('http://127.0.0.1:8090');
		// Login to PocketBase
		const authData = await client.admins.authViaEmail(`${email}`, `${password}`);
		// Get the guilds data
		const records = await client.records.getFullList('guilds');
		// Get how many guilds there are
		let guilds = records.length;
		// Get the guildid data from the database to see if it exists already will later be populated
		let guildidcheck = '';
		// base link that will later be populated
		let baselink = '';
		// Iterate through guilds and check if it exists if it does not continue if it does send a message to the server owner
		let i = 0;
		while (i < guilds) {
			let guildcheck = '';
			// console.log(i);
			guildcheck = records[i].guildID;
			if (guildcheck == guildID) {
				guildidcheck = guildcheck;
				console.log(guildidcheck);
				break;
			} else {
			i ++
			}
		}
		if (guildidcheck == guildID) {
			return await interaction.reply('This server is already set up! You can run /update to update settings! \n If you want to increase or decrease your link limit please run /limit \n If you want to reset completely run /reset');
		}
		// END ITERATION
		async function pocketbasstart() {
			// Connect to the database
			const client = new PocketBase('http://127.0.0.1:8090');
			const authData = await client.admins.authViaEmail(`${email}`, `${password}`);
			// Create a new record for the guild 
			const newRecord = await client.records.create('guilds', {
				guildID: guildID,
				roleIDs: roles,
				premium: 'yes',
				invite: dinvv,
				usesallowed: usesv,
			});
			// Create a new record for the user
			const newUser = await client.records.create('users', {
				iduser: userID,
				idguild: guildID,
				numberofuses: 0,
				owner: true,
			});
			// Create a new record for the base link
			const newBase = await client.records.create('links', {
				guildID: guildID,
				// set baselink with json
				links:  [ {
					name: 'base',
					link: baselink,
					id: null
				} ]
			});
			return;
		}
		// Set the base link
		async function baselinkset() {
			const filter = m => m.author.id == interaction.user.id;
			const collector = interaction.channel.createMessageCollector({ filter, time: 30000, errors: ['time'] });
			collector.on('collect', async (m) => {
				// check if the message has a number between 1 and 100
				if (m.content.includes('https://') || m.content.includes('http://')) {
				base = m.content;
				// console.log(roles);
				await interaction.followUp({ content: `Thanks! The base proxy link you set was: ${m.content} this will be deleted later` });
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
					await interaction.followUp({ content: 'Please use a valid link starting with either https:// or http:// re-run this command to try again' });
				}
				else {
					baselink = base;
					await interaction.followUp({ content: 'Thanks for setting me up please wait while i add this to my database!' });
					await pocketbasstart();
					await interaction.followUp({ content: 'Thanks for setting me up! All data is added and you can now start using /add, /reset-users, /reset-user(Not working at the moment!) and /proxy' })
				}
			});
		}
		// Set the uses the user can use
		async function setuses() {
			const filter = m => m.author.id == interaction.user.id;
			const collector = interaction.channel.createMessageCollector({ filter, time: 30000, errors: ['time'] });
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
					await interaction.followUp({ content: 'Please use a number 1 - 100 re-run this command to try again' });
				}
				else {
					// console.log(`Collected ${collected.size} items. For reason: ${reason}`);
					// pocketbasstart();
					await interaction.followUp({ content: 'Next up: what is the first link you want to add (will be deleted when using /add) (Timeout 30 sec)' });
					// setuses();
					baselinkset();
				}
			});
		}
		// Set discord invite
		async function dinv() {
			const filter = m => m.author.id == interaction.user.id;
			const collector = interaction.channel.createMessageCollector({ filter, time: 30000, errors: ['time'] });
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
					await interaction.followUp({ content: 'Please use a valid discord invite (https://discord.gg/) re-run this command to try again' });
				}
				else {
					// console.log(`Collected ${collected.size} items. For reason: ${reason}`);
					// pocketbasstart();
					interaction.followUp({ content: 'Next Up How many links would you like one user to get? (e.g 3 links per month) (Timeout 30 sec)' });
					setuses();
					// pocketbasstart();
				}
			});
		} 
		// Welcome message
		await interaction.reply({ content: 'Welcome to the setup process! To get started ping a **SINGLE** role you want to run the /reset-users command (Timeout 30 sec)'});
		//interaction collector
		const filter = m => m.author.id == interaction.user.id;
		const collector = interaction.channel.createMessageCollector({ filter, time: 30000, errors: ['time'] });
		collector.on('collect', async (m) => {
			if (m.content !== '<@&' + m.content.slice(3, -1) + '>') {
				return collector.stop('invalid');
			} else if (m.content.includes(' ')) {
				return collector.stop('invalid');
			} else if (m.content.includes(',')) {
				return collector.stop('invalid');
			}
			console.log(m.content);
			roles = m.content;
			console.log(roles);
			await interaction.followUp({ content: `Thanks! For your input you role(s) you selected were: ${m.content}` });
			collector.stop('done');
		});
		collector.on('end', async (collected, reason) => {
			//console.log(`Collected ${collected.size} items. For reason: ${reason}`);
			if (reason == 'time') {
				interaction.followUp({ content: 'You did not respond in time! Please re run this command to try again.' });
			}
			else if (reason == 'invalid') {
				await interaction.followUp({ content: 'Please ping a **SINGLE** role! Please re-try by re-running this command!' });
			}
			else {
				// console.log(`Collected ${collected.size} items. For reason: ${reason}`);
				// pocketbasstart();
				interaction.followUp({ content: 'Continuing on, what is the invite link to your discord server? (This will be premium only at some point) (Time out 30 sec)' });
				dinv();
			}
		});
	}
};
