import InteractionCreate from "./InteractionCreate.js";
import Ready from "./Ready.js";

import type { DiscordClient } from "../lib/types.js";

const handlers = [InteractionCreate, Ready];

export async function loadEventHandlers(client: DiscordClient) {
  for (let handler of handlers) {
    await handler(client);
  }
}
