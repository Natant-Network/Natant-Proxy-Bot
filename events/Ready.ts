import { Events, ActivityType } from "discord.js";
import type { DiscordClient } from "../lib/types.js";

async function getServerCount(client: DiscordClient) {
  if(client.shard) return (await client.shard.fetchClientValues("guilds.cache.size")).reduce((a: any, b: any) => a + b);
  return client.guilds.cache.size;
}

async function setPresence(client: DiscordClient) {
  const serverCount = await getServerCount(client);
  client.user?.setPresence({
    status: "online",
    activities: [
      {
        name: `${serverCount} server${serverCount !== 1 ? "s" : ""}${Array.isArray(client.shard?.ids) ? ` | Shard ${client.shard?.ids}` : ""}`,
        type: ActivityType.Watching
      }
    ]
  });
};

export default async function registerHandler(client: DiscordClient) {
  client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag} (${client.user?.id})`);

    // Register the commands
    const data: any = client.commands.map(command => command?.data);
    client.application?.commands.set(data);

    // Set the bot's status
    setPresence(client);
    setInterval(setPresence, 300000, client); // 5 minutes
  });
}