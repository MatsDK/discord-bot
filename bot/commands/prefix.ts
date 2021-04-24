import { prefixState } from "../constants";
import { commandType } from "../types";
import { Command, CommandClass } from "./utils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          if (args.length < 1)
            return message.reply("Please provide a new prefix");
          if (args[0].trim().length < 1) return message.reply("Invalid prefix");
          prefixState.setPrefix(args[0]);

          message.reply(`Prefix changed to \` ${args[0]} \``);
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}
