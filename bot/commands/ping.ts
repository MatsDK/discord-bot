import { commandType } from "../types";
import { Command } from "./utils/Command";

export default {
  keyword: "ping",
  roles: {
    allRoles: true,
    consentedRoles: [],
  },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: true,
  description: "",
  reply: "",
  id: "e3gZU3hIXFDr4P_JnKzSf9",
  async execute(client: any, message: any, args: any) {
    message.reply("Calculating ping...").then((returnMessage: any) => {
      return returnMessage.edit(
        `\nBot latency: ${
          returnMessage.createdTimestamp - message.createdTimestamp
        }ms \nAPI latency: ${client.ws.ping}ms`
      );
    });
  },
};

export class CommandConstructor {
  command: any;

  constructor(cmdDetails: commandType) {
    this.command = new Command(cmdDetails, (client, message, args) => {
      message.reply("Calculating ping...").then((returnMessage: any) => {
        return returnMessage.edit(
          `\nBot latency: ${
            returnMessage.createdTimestamp - message.createdTimestamp
          }ms \nAPI latency: ${client.ws.ping}ms`
        );
      });
    });
  }
}
