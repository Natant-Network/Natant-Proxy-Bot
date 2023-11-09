import * as Add from "./add.js";
import * as Category from "./category.js";
import * as DM from "./dm.js";
import * as GetStarted from "./get-started.js";
import * as Help from "./help.js";
import * as Limit from "./limit.js";
import * as List from "./list.js";
import * as Panel from "./panel.js";
import * as Proxy from "./proxy.js";
import * as ResetContextCMD from "./reset-contextCmd.js";
import * as Reset from "./reset.js";
import * as Usage from "./usage.js";
import * as ViewContextCMD from "./view-contextCmd.js";
import * as View from "./view.js";

import type { DiscordClient, SlashCommand } from "../lib/types.js";

// @ts-ignore
const commands: SlashCommand[] = [
  Add,
  Category,
  DM,
  GetStarted,
  Help,
  Limit,
  List,
  Panel,
  Proxy,
  ResetContextCMD,
  Reset,
  Usage,
  ViewContextCMD,
  View
]

export async function loadSlashCommands(client: DiscordClient) {
  for (const command of commands) {
    client.commands.set(command.data.name, command);
  }
}