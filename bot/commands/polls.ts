import { commandType, dbGuildType, pollType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import guildBot from "../../server/db/models/guildBot";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const dbGuild: dbGuildType = await guildBot.findOne({
            guildId: message.guild.id,
          });
          if (!dbGuild) return;

          message.channel.send(`
            \` Polls \`:\n${dbGuild.polls
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
