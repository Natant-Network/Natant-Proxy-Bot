import { EmbedBuilder } from 'discord.js';
import guildModel from '../schema/guild';
import userModel from '../schema/user';

export default async function viewUser(user: any, GuildId: string) {
  const doc = await guildModel.findOne({ GuildId });
  if(!doc) return {
    content: 'Server not found! Please tell the server owner or a admin to run /get-started!', 
    ephemeral: true
  };
  const userData = await userModel.findOne({ UserId: user.id });
  if(!userData) return {
    content: 'That user has not used the proxy bot!',
    ephemeral: true
  };
  if(!userData.guilds[GuildId]) return {
    content: 'That user has not used the proxy bot!',
    ephemeral: true
  };
  const links: string = userData.guilds[GuildId].links.slice(0, doc.limit).join('\n');
  const embed = new EmbedBuilder()
    .setAuthor({ name: `Usage data for ${user.tag}`, iconURL: user.displayAvatarURL() })
    .addFields([
      { name: 'Curent Usage', value: `${userData.guilds[GuildId].uses} (out of ${doc.limit})` },
      { name: `Last ${doc.limit} links`, value: links }
    ]);
  return { embeds: [embed], ephemeral: true };
}