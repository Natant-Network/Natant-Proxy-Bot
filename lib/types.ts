import { Client, Collection } from "discord.js";

export interface DiscordClient extends Client {
  commands: Collection<String, SlashCommand>;
  loadSlashCommands: Function;
  loadEventHandlers: Function;
  logger: any;
}

export interface SlashCommand {
  data: any;
  run: Function;
  autocomplete?: Function;
  modal?: Function;
}

export interface GuildLink {
  type: String,
  domain: String
}