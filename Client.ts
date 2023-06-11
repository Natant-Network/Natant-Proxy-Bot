import { Client, Collection, ClientOptions } from 'discord.js';
import type { SlashCommand } from './types';
import { readdirSync } from 'node:fs';

class DiscordClient extends Client {
  constructor(opts: ClientOptions) {
    super(opts);
  }

  logger: any = {};
  commands: Collection<String, SlashCommand> = new Collection();
  // Messages that are used a lot
  messages: Map<String, String> = new Map([
    [
      // Also used in lib/proxy.ts
      'ERR_SERVER_NOT_FOUND',
      'Server not found! Please tell the server owner or a admin to run /get-started!'
    ],
    [
      'ERR_SERVER_NOT_FOUND_ADMIN',
      'Server not found! Please run /get-started to set up Link Master!'
    ],
    [
      'ERR_NEED_PREMIUM',
      'You can purchase premium with `/premium view`'
    ],
    [
      'ERR_FAILED_DM',
      'Failed to DM you the requested link!'
    ],
    [
      'MSG_CHECK_DMS',
      'Check your DMs for the requested link!'
    ]
  ]);

  async loadSlashCommands() {
    const rawFiles = readdirSync('./commands');
    const files = rawFiles.filter(file => file.endsWith('.ts'));
    for (let file of files) {
      try {
        let pull: SlashCommand = await import(`./commands/${file}`);
        if (!pull.data) {
          console.log(`Could not parse exports.data for command ${file}`);
          continue;
        }
        if (pull.run) {
          this.commands.set(pull.data.name, pull);
        } else {
          console.log(`Command file ${file} is missing a run callback`);
          continue;
        }
      } catch(error) {
        console.log(`Failed to load command file ${file}`)
        console.error(error);
      }
    }
  }
  
  async loadEventHandlers() {
    const rawFiles = readdirSync('./events');
    const files = rawFiles.filter(file => file.endsWith('.ts'));
    for(let file of files) {
      try {
        console.log(`Loading event handler ${file}`)
        const handler: any = await import(`./events/${file}`);
        // @ts-ignore
        await handler.default(this);
      } catch(error) {
        console.log(`Failed to load event handler file ${file}`)
        console.error(error);
      }
    }
  }
}

export default DiscordClient;