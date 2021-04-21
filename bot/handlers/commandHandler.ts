import fs from "fs";
import path from "path";
import commands from "../../bot/commands/commands.json";
import { commandType } from "../types";

export const commandHandler = async (client: any, Discord: any) => {
  const commandFiles = fs
    .readdirSync(path.resolve(__dirname, "../commands"))
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const { default: command } = await import(`../commands/${file}`);

    if (command.keyword) client.commands.set(command.keyword, command);
    else continue;
  }

  Object.keys(commands).forEach((key: string) => {
    const cmd: commandType = commands[key];
    if (!cmd.action) client.commands.set(cmd.keyword, cmd);
  });
};
