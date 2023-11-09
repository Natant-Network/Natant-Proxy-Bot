import InteractionCreate from "./InteractionCreate.ts";
import MessageCreate from "./MessageCreate.ts";
import Ready from "./Ready.ts";

import type { DiscordClient } from "../lib/types.ts";

const handlers = [InteractionCreate, MessageCreate, Ready];

export async function loadEventHandlers(client: DiscordClient) {
  for (let handler of handlers) {
    await handler(client);
  }
}
