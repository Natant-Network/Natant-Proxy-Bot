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

    var _save = false;
    // Find the document with the specified category
    const doc = await guildModel.findOne({ GuildId });

    // If the category doesn't exist, return a error
    if (!doc) return reject(new ProxyError(ClientMessages.ERR_SERVER_NOT_FOUND));
    const LinkLimit = doc.limit || 3;

    var user: any = await userModel.findOne({ UserId });

    if (!user) {
      user = new userModel({
        UserId,
        links: [],
        guilds: {}
      });
      _save = true;
    }
    if (!user.guilds[GuildId]) {
      user.guilds[GuildId] = {
        uses: 0,
        links: []
      };
      user.markModified(`guilds.${GuildId}`);
      _save = true;
    }
    if (_save) {
      await doc.save();
      _save = false;
    }
    if (!doc.types.includes(category)) return reject(new ProxyError(ProxyMessages.ERR_CATEGORY_NOT_FOUND.replace("%s", category)));

    if (user && (user.guilds[GuildId].uses) >= LinkLimit) {
      return reject(new ProxyError(ProxyMessages.ERR_REACHED_LINK_LIMIT.replace("%s", LinkLimit.toString())));
    }

    if (doc.links.length === 0) return reject(new ProxyError(ProxyMessages.ERR_NO_LINKS.replace("%s", category)));

    // Select a random link from the document's links array that the user has not already received
    const linksToChooseFrom = doc.links.filter(
      (link: GuildLink) => !(user.guilds[GuildId].links).includes(link.domain)
    );
    if (linksToChooseFrom.length === 0) return reject(new ProxyError(ProxyMessages.ERR_GOT_ALL_LINKS.replace("%s", category)));
    const randomLink = linksToChooseFrom[Math.floor(Math.random() * linksToChooseFrom.length)];

    // Create a Embed
    const embed = new EmbedBuilder()
      .setTitle(`Link request for category ${category}`)
      .setColor("#4a0f0f")
      .addFields([
        { name: "Domain:", value: `${randomLink.domain}` },
        { name: "Remaining uses:", value: `${LinkLimit - (user.guilds[GuildId].uses + 1)}` }
      ])
      .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

    if (doc.dmMode && interaction.guild?.members.cache.size < 100 && !doc.isPremium) {
      doc.dmMode = false;
      doc.save();
    }
    
    resolve({
      dm: doc.dmMode || false,
      data: { embeds: [embed] }
    });
    user.guilds[GuildId].links.unshift(randomLink.domain);
    user.guilds[GuildId].uses++;
    user.markModified(`guilds.${GuildId}`)
    await user.save();
  })
}