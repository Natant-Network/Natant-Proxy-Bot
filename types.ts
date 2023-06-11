import { Client, Collection } from 'discord.js';

type CommandHandler = {
    commands: Collection<String, SlashCommand>;
    messages: Map<String, String>;
    loadSlashCommands: Function;
    loadEventHandlers: Function;
    logger: any;
}
export type DiscordClient = CommandHandler & Client;
  
export type SlashCommand = {
    data: any;
    type: number;
    name: string;
    run: Function;
    autocomplete?: Function;
    modal?: Function;
}

export type GuildLink = {
    type: String,
    domain: String
}