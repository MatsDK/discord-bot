import commands from "../../bot/commands/commands.json";
import actions from "../../bot/commands/actions.json";
import { commandType } from "../types";

export const commandHandler = async (client: any, Discord: any) => {
  Object.keys(actions).forEach(async (key: string) => {
    const cmd: commandType = actions[key];
    const { CommandConstructor } = await import(`../commands/${cmd.fileName}`);

    const { command }: { command: commandType } = new CommandConstructor(cmd);
    client.commands.set(command.keyword, command);
  });

  Object.keys(commands).forEach((key: string) => {
    const cmd: commandType = commands[key];
    cmd.id = key;

    client.commands.set(cmd.keyword.toLowerCase(), cmd);
  });
};
