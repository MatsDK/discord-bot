import { commandType } from "../types";
import { Command, CommandClass } from "./utils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const ans: string = ["Heads", "Tails"][Math.round(Math.random())];
          message.reply(`The winner is \` ${ans} \``);
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}
