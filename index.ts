// DiscordJS
import { GatewayIntentBits } from 'discord.js';
import Client from './Client';

// Types
import type { DiscordClient } from './types';

// Libraries
import mongoose from 'mongoose';
import * as winston from 'winston';

// Config
import * as denv from 'dotenv';
denv.config();

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: 'log.log',
      level: 'info'
    }),
    new winston.transports.Console()
  ]
});

// We want GuildMessages to tell the users who try to use message commands
// that we do not use them
const client: DiscordClient = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});
client.logger = logger;
client.loadEventHandlers();
client.loadSlashCommands();

mongoose.connect(process.env.MONGODB_URI || '').then(() => logger.log({
  level: 'info',
  message: 'MongoDB connected'
})).catch(err => {
  console.log(err);
  logger.log({
    level: 'error',
    message: 'Failed to connect to MongoDB'
  });
});

client.login(process.env.DISCORD_TOKEN);