import "dotenv/config";
import * as winston from "winston";
import { ShardingManager } from "discord.js";
const isTSNode = Symbol.for("ts-node.register.instance") in process;
const logger = winston.createLogger({
  level: "debug",
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({
      filename: "log.log",
      level: "info"
    }),
    new winston.transports.Console()
  ]
});

const manager = new ShardingManager(isTSNode ? "./index.ts" : "./index.js", {
  token: process.env.DISCORD_TOKEN
});

manager.on("shardCreate", shard => {
  logger.info(`Launched shard ${shard.id}`)
});

manager.spawn({
  timeout: (isTSNode ? 60 : 30) * 1000
});