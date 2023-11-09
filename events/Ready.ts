import { Events, ActivityType } from "discord.js";
import type { DiscordClient } from "../lib/types.js";

export default function registerHandler(client: DiscordClient) {
  function setPresence() {
    client.user?.setPresence({
      status: "online",
      activities: [
        {
          name: `${client.guilds.cache.size} server${client.guilds.cache.size !== 1 ? "s" : ""}`,
          type: ActivityType.Watching
        }
      ]
    });
  };
  client.once(Events.ClientReady, () => {
    const { logger } = client;
    logger.log({
      level: "info",
      message: `Logged in as ${client.user?.tag} (${client.user?.id})`
    });

    // Register the commands
    const data: any = client.commands.map(command => command?.data);
    client.application?.commands.set(data);

    // Set the bot's status
    setPresence();
    setInterval(setPresence, 300000); // 5 minutes
  });
}