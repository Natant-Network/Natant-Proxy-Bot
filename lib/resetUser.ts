import { userModel } from "./schema.js";

export default async function resetUser(UserId: string, GuildId: string) {
  const doc: any = await userModel.findOne({ UserId });
  if(!doc) return { done: false };
  if(!doc.guilds[GuildId]) return { done: false };
  const oldUsage = doc.guilds[GuildId].uses;
  doc.guilds[GuildId].uses = 0;
  doc.markModified(`guilds.${GuildId}`);
  await doc.save();
  return {
    done: true,
    oldUsage
  }
}