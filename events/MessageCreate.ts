import { Events, EmbedBuilder } from "discord.js";
import type { DiscordClient } from "../lib/types.ts";

export default function registerHandler(client: DiscordClient) {
  client.on(Events.MessageCreate, message => {
    if(message.author.bot) return;
    // @ts-ignore The bot has to be logged in to recive the messageCreate event, so client.user cannot be null
    if(message.mentions.users.get(client.user.id)) {
      const embed = new EmbedBuilder()
        .setDescription(`<@${message.author.id}> This bot uses [Slash Commands](https://discord.com/blog/welcome-to-the-new-era-of-discord-apps)`);
      message.reply({ embeds: [embed] })
    }
  });
}