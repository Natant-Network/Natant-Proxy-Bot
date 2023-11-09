import * as Add from "./add.ts";
import * as Category from "./category.ts";
import * as DM from "./dm.ts";
import * as GetStarted from "./get-started.ts";
import * as Help from "./help.ts";
import * as Limit from "./limit.ts";
import * as List from "./list.ts";
import * as Panel from "./panel.ts";
import * as Proxy from "./proxy.ts";
import * as ResetContextCMD from "./reset-contextCmd.ts";
import * as Reset from "./reset.ts";
import * as Usage from "./usage.ts";
import * as ViewContextCMD from "./view-contextCmd.ts";
import * as View from "./view.ts";

import type { DiscordClient, SlashCommand } from "../lib/types.ts";

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