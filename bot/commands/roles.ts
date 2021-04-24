import { commandType } from "../types";
import { Command, CommandClass } from "./utils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const roles: string = Array.from(message.guild.roles.cache)
            .sort((a: any, b: any) => b[1].rawPosition - a[1].rawPosition)
            .map(([key, _]: any) => _.name)
            .map((role: string) => `-${role}`)
            .join(`\n`);

          return message.channel.send(`\n ${roles}`);
        } catch (err) {
          message.reply("An error");
        }
      }
    );
  }
}
