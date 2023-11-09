import "dotenv/config";

import { Client, GatewayIntentBits, Collection } from "discord.js";

import { loadEventHandlers } from "./events/index.ts";
import { loadSlashCommands } from "./commands/index.ts";

import type { DiscordClient, SlashCommand } from "./lib/types.ts";

import mongoose from "mongoose";
import * as winston from "winston";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: "log.log",
      level: "info"
    }),
    new winston.transports.Console()
  ]
});

// We want GuildMessages to tell the users who try to use message commands
// that we do not use them
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
}) as DiscordClient;
client.logger = logger;
client.commands = new Collection<String, SlashCommand>();

loadEventHandlers(client);
loadSlashCommands(client);

mongoose.connect(process.env.MONGODB_URI || "").then(() => logger.log({
  level: "info",
  message: "MongoDB connected"
})).catch(err => {
  console.log(err);
  logger.log({
    level: "error",
    message: "Failed to connect to MongoDB"
  });
});

client.login(process.env.DISCORD_TOKEN);