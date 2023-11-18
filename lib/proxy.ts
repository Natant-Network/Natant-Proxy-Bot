import {
  EmbedBuilder
} from "discord.js";
import { guildModel, userModel } from "../lib/schema.js";
import type { GuildLink } from "./types.js";
import { ClientMessages, ProxyMessages } from "./messages.js";

interface ProxyMessage {
  dm: boolean;
  data: any;
}

export class ProxyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProxyError";
  }
}

export function getProxy(interaction: any, category: string) : Promise<ProxyMessage> {
  return new Promise(async (resolve, reject) => {
    const GuildId: string = interaction.guild!.id;
    const UserId = interaction.user.id;

    // Find the document with the specified category
    const doc = await guildModel.findOne({ GuildId });

    // If the category doesn't exist, return a error
    if (!doc) return reject(new ProxyError(ClientMessages.ERR_SERVER_NOT_FOUND));
    const LinkLimit = doc.limit || 3;

    var user: any = await userModel.findOne({ UserId });

    if (!user) {
      user = new userModel({ UserId });
      await doc.save();
    };
    var userLinks = user.guilds.get(GuildId) || { uses: 0, links: [] };

    if (!doc.types.includes(category)) return reject(new ProxyError(ProxyMessages.ERR_CATEGORY_NOT_FOUND.replace("%s", category)));

    if (user && (userLinks.uses) >= LinkLimit) {
      return reject(new ProxyError(ProxyMessages.ERR_REACHED_LINK_LIMIT.replace("%s", LinkLimit.toString())));
    }

    if (doc.links.length === 0) return reject(new ProxyError(ProxyMessages.ERR_NO_LINKS.replace("%s", category)));

    // Select a random link from the document's links array that the user has not already received
    const linksToChooseFrom = doc.links.filter(
      (link: GuildLink) => !(userLinks.links).includes(link.domain)
    );
    if (linksToChooseFrom.length === 0) return reject(new ProxyError(ProxyMessages.ERR_GOT_ALL_LINKS.replace("%s", category)));
    const randomLink = linksToChooseFrom[Math.floor(Math.random() * linksToChooseFrom.length)];

    // Create a Embed
    const embed = new EmbedBuilder()
      .setTitle(`Link request for category ${category}`)
      .setColor("#4a0f0f")
      .addFields([
        { name: "Domain:", value: `${randomLink.domain}` },
        { name: "Remaining uses:", value: `${LinkLimit - (userLinks.uses + 1)}` }
      ])
      .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

    if (doc.dmMode && interaction.guild!.members.cache.size < 100 && !doc.isPremium) {
      doc.dmMode = false;
      doc.save();
    }
    
    resolve({
      dm: doc.dmMode || false,
      data: { embeds: [embed] }
    });

    userLinks.links.unshift(randomLink.domain);
    userLinks.uses++;
    user.guilds.set(GuildId, userLinks);
    await user.save();
  })
}