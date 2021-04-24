import { commandType } from "../types";
import { Command, CommandClass } from "./utils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        message.reply("Calculating ping...").then((returnMessage: any) => {
          return returnMessage.edit(
            `\nBot latency: ${
              returnMessage.createdTimestamp - message.createdTimestamp
            }ms \nAPI latency: ${client.ws.ping}ms`
          );
        });
      }
    );
  }
}
