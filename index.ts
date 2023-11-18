import { Client, GatewayIntentBits, Collection } from "discord.js";

import { loadEventHandlers } from "./events/index.js";
import { loadSlashCommands } from "./commands/index.js";

import type { DiscordClient, SlashCommand } from "./lib/types.js";

import mongoose from "mongoose";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
}) as DiscordClient;
client.commands = new Collection<String, SlashCommand>();

loadEventHandlers(client);
loadSlashCommands(client);

mongoose.connect(process.env.MONGODB_URI || "").then(() => console.log("MongoDB connected")).catch(err => {
  console.log("Failed to connect to MongoDB");
  throw err;
});

client.login();