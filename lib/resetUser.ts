import { userModel } from "./schema.js";

export default async function resetUser(UserId: string, GuildId: string) {
  const doc: any = await userModel.findOne({ UserId });
  if(!doc) return { done: false };
  if(!doc.guilds.has(GuildId)) return { done: false };
  const uG = doc.guilds.get(GuildId)!;
  const oldUsage = uG.uses;
  uG.uses = 0;
  doc.guilds.set(GuildId, uG);
  await doc.save();
  return {
    done: true,
    oldUsage
  }
}