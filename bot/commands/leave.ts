import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          message.member.kick().catch((err) => {
            message.reply("An error occured");
          });
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}
