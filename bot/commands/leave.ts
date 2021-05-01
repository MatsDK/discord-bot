import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          if (
            !message.member.kickable ||
            !message.guild.me.hasPermission("KICK_MEMBERS")
          )
            return message.reply("I don't have permissions to remove you");

          message.member.kick().catch(() => {
            message.reply("I can't remove this user");
          });
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}
