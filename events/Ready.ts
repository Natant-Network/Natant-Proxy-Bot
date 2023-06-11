import { Events, ActivityType } from 'discord.js';
import type { DiscordClient } from '../types';
import axios from 'axios';

const roleMetadata: Array<any> = [
  {
    key: 'used',
    name: 'Used the bot',
    description: 'User has used the proxy bot',
    type: 7
  },
  {
    key: 'uses',
    name: 'Uses',
    description: 'Minimum amount of bot uses',
    type: 2
  }
]

export default function registerHandler(client: DiscordClient) {
  function setPresence() {
    client.user?.setPresence({
      status: 'online',
      activities: [
        {
          name: `${client.guilds.cache.size} server${client.guilds.cache.size !== 1 ? 's' : ''}`,
          type: ActivityType.Watching
        }
      ]
    });
  };
  client.once(Events.ClientReady, () => {
    const { logger } = client;
    logger.log({
      level: 'info',
      message: `Logged in as ${client.user?.tag} (${client.user?.id})`
    });

    // Register the commands
    const data: any = client.commands.map(command => command?.data);
    client.application?.commands.set(data);

    // Push the Linked Role Data
    axios({
      method: 'PUT',
      url: `https://discord.com/api/v10/applications/${client.user?.id}/role-connections/metadata`,
      data: roleMetadata,
      headers: {
        Authorization: `Bot ${client.token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      logger.log({
        level: 'info',
        message: 'Pushed linked role metadata'
      })
    })
    .catch(console.error);

    // Set the bot's status
    setPresence();
    setInterval(setPresence, 300000); // 5 minutes
  });
}