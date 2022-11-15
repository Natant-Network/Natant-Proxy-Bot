const { Message, SlashCommandBuilder, GuildDefaultMessageNotifications, InteractionWebhook } = require('discord.js');
const { email, password } = require('../config.json');
const PocketBase = require('pocketbase/cjs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('proxy')
        .setDescription('Get a proxy'),
    async execute(interaction, args) {
        // get the user id from the command
        let userid = interaction.user.id;
        // get the guild id from the command
        let guildid = interaction.guild.id;
        let ownerid = interaction.guild.ownerId;
        // console.log('userid: ' + userid);
        // check if the user is already in the database
        const client = new PocketBase('http://127.0.0.1:8090');
        const authData = await client.admins.authViaEmail(`${email}`, `${password}`);
        await interaction.reply({content: 'Checking if the server is setup...', ephemeral: true});
        const guildscount = await client.records.getFullList('guilds');
        const check = await await client.records.getFullList('guilds', parseInt(guildscount.length), {
            filter: `guildID = ${guildid}`,
        });
        if (check.length == 0) {
            await interaction.followUp({content: 'This server is not setup! Ask the server owner to run /get-started', ephemeral: true});
            return;
        } else {
        //console.log(check);
        
                const records = await client.records.getFullList('users');
                await interaction.followUp({content: 'Checking if you are already in the database...', ephemeral: true });
                let i = 0;
                let usercheck = '';
                let usercheckid = '';
                let usercheckguild = '';
                let usercheckuses = '';
                let count = records.length;
                // check if user is in the database
                if (ownerid == userid) {
                    await interaction.followUp({ content: 'You are the owner of this server! You should not need links!', ephemeral: true });
                } else {
                    // check if user is in the database with pocketbase filtering
                    // get count of records in the database
                    const idofuser = await client.records.getFullList('users', parseInt(count), {
                        filter: `iduser = '${userid}' && idguild = '${guildid}'`,
                        // add a second filter
                    
                        // sort: '-created,title',
                    });
                    console.log(idofuser);
                    if (idofuser.length == 0) {
                        // if user is not in the database, add them
                        await interaction.followUp({ content: 'You are not in the database! Adding you now...', ephemeral: true });
                        const newrecord = await client.records.create('users', {
                            iduser: `${userid}`,
                            idguild: `${guildid}`,
                            uses: 0,
                            owner: false
                        });
                        await interaction.followUp({ content: 'Added you to the database!', ephemeral: true });
                    } else {
                        await interaction.followUp({ content: 'You are already in the database! Getting your info...', ephemeral: true });
                    }
                
                }
    }
}
    }