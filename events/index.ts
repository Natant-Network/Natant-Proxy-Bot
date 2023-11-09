import InteractionCreate from "./InteractionCreate.js";
import MessageCreate from "./MessageCreate.js";
import Ready from "./Ready.js";

import type { DiscordClient } from "../lib/types.js";

const handlers = [InteractionCreate, MessageCreate, Ready];

export async function loadEventHandlers(client: DiscordClient) {
  for (let handler of handlers) {
    await handler(client);
  }
}
