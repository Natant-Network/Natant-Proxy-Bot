import {
  EmbedBuilder
} from 'discord.js';
import guildModel from '../schema/guild';
import userModel from '../schema/user';
import type { GuildLink } from '../types';

export const ErrorCodes = new Map<string, string>([
  ['ERR_SERVER_NOT_FOUND', 'Server not found! Please tell the server owner or a admin to run /get-started!'],
  ['ERR_CATEGORY_NOT_FOUND', 'Invalid category `$category`'],
  ['ERR_REACHED_LINK_LIMIT', 'You have reached the limit of $limit links set by the server'],
  ['ERR_GOT_ALL_LINKS', 'You have already received all available links for category `$category`'],
  ['ERR_NO_LINKS', 'There are no available links for category `$category`']
]);

type ProxyMessage = {
  dm: boolean;
  data: any;
}

export class ProxyError extends Error {
  constructor(code: string, props: Object = {}) {
    super();
    this.name = 'ProxyError';
    // @ts-ignore don't care + didn't ask
    this.code = code;
    let msg: string = ErrorCodes.get(code) || '';
    for (const [name, val] of Object.entries(props)) {
      msg = msg.replace(name, val);
    }
    this.message = msg;
  }
  static isProxyError = true;
}

export async function getProxy(interaction: any, category: string) {
  // @ts-ignore guild.id cannot be undefined
  const GuildId: string = interaction.guild.id;
  const UserId = interaction.user.id;
  var _save = false;
  // Find the document with the specified category
  const doc = await guildModel.findOne({ GuildId });

  // If the category doesn't exist, return a error
  if (!doc) throw new ProxyError('ERR_SERVER_NOT_FOUND');
  const LinkLimit = doc.limit || 3;

  var user: any = await userModel.findOne({ UserId });

  if (!user) {
    user = new userModel({
      UserId,
      thisMonth: 0,
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
  if (!doc.types.includes(category)) throw new ProxyError('ERR_INVALID_CATEGORY', { $category: category });

  if (user && (user.guilds[GuildId].uses) >= LinkLimit) {
    throw new ProxyError('ERR_REACHED_LINK_LIMIT', { $limit: LinkLimit });
  }

  if (doc.links.length === 0) throw new ProxyError('ERR_NO_LINKS', { $category: category });

  // Select a random link from the document's links array that the user has not already received
  const linksToChooseFrom = doc.links.filter(
    (link: GuildLink) => !(user.guilds[GuildId].links).includes(link.domain)
  );
  if (linksToChooseFrom.length === 0) throw new ProxyError('ERR_GOT_ALL_LINKS', { $category: category });
  const randomLink = linksToChooseFrom[Math.floor(Math.random() * linksToChooseFrom.length)];

  // Create a Embed
  const embed = new EmbedBuilder()
    .setTitle(`Link request for category ${category}`)
    .setColor('#4a0f0f')
    .addFields([
      { name: 'Domain:', value: `${randomLink.domain}` },
      { name: 'Remaining uses:', value: `${LinkLimit - (user.guilds[GuildId].uses + 1)}` }
    ])
    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

  if (doc.dmMode && interaction.guild?.members.cache.size < 100 && !doc.isPremium) {
    doc.dmMode = false;
    doc.save();
  }

  const res: ProxyMessage = {
    dm: doc.dmMode || false,
    data: { embeds: [embed] }
  };
  user.guilds[GuildId].links.unshift(randomLink.domain);
  user.guilds[GuildId].uses++;
  user.markModified(`guilds.${GuildId}`)
  await user.save();
  return res;
}