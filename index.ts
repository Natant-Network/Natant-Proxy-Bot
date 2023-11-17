import { Client, GatewayIntentBits, Collection } from "discord.js";

import { loadEventHandlers } from "./events/index.js";
import { loadSlashCommands } from "./commands/index.js";

import type { DiscordClient, SlashCommand } from "./lib/types.js";

import mongoose from "mongoose";

// We want GuildMessages to tell the users who try to use message commands
// that we do not use them
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
}) as DiscordClient;
client.commands = new Collection<String, SlashCommand>();

loadEventHandlers(client);
loadSlashCommands(client);

mongoose.connect(process.env.MONGODB_URI || "").then(() => console.log("MongoDB connected")).catch(err => {
  console.log("Failed to connect to MongoDB");
  console.log(err);
});

client.login();