import { commandType, PollOption, pollType } from "../types";
import { Command, CommandClass } from "./utils/Command";
import polls from "../poll.json";
import Discord from "discord.js";
import { isTimeStr, msToTime } from "./utils/getTimeInMs";
import formatTime from "./utils/getTimeInMs";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          let pollDuration: any;
          if (args.length > 1 && isTimeStr(args[args.length - 1])) {
            pollDuration = formatTime(args[args.length - 1]);
            args = args.slice(0, args.length - 1);
          }

          const pollName: string = args.join(" ").trim();
          if (!pollName)
            return message.reply("Please provide the name of the poll");

          const key: string | undefined = Object.keys(polls).find(
            (key: string) =>
              polls[key].name.toLowerCase() === pollName.toLowerCase()
          );
          const thisPoll: pollType = key ? polls[key] : polls[pollName];
          if (!thisPoll) return message.reply("Poll not found");

          const embed = new Discord.MessageEmbed()
            .setTitle(thisPoll.content)
            .setDescription(
              `
           ${thisPoll.description}\n
            ${thisPoll.options
              .map((_: PollOption) => `${_.emoji}  |   ${_.text}`)
              .join("\n")}
           `
            )
            .setFooter(
              pollDuration
                ? pollDuration.formattedDuration
                : thisPoll.hasDuration
                ? msToTime(thisPoll.duration)
                : "Unspecified"
            );

          const MessageEmbed = await message.channel.send(embed);
          for (let option of thisPoll.options)
            await MessageEmbed.react(option.emoji);

          if (!pollDuration) {
            if (thisPoll.hasDuration)
              setTimeout(() => {
                MessageEmbed.delete();
              }, thisPoll.duration);
          } else
            setTimeout(() => {
              MessageEmbed.delete();
            }, pollDuration.ms);
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}
