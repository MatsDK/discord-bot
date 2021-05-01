import { commandType, pollType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import polls from "../poll.json";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          message.channel.send(`
            \` Polls \`:\n${Object.keys(polls)
              .map((_: string) => polls[_])
              .map(
                (_: pollType) =>
                  `-**${_.name}**: ${_.description}, ${_.options.length} Options`
              )
              .join("\n")}`);
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}
