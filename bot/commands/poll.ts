import { commandType, PollOption, pollType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import polls from "../poll.json";
import Discord, { Client, MessageReaction, Role } from "discord.js";
import { isTimeStr, msToTime } from "../commandUtils/getTimeInMs";
import formatTime from "../commandUtils/getTimeInMs";

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

          if (!thisPoll.rolePoll)
            handlePollCommand(message, args, thisPoll, pollDuration);
          else handleRolePoll(message, args, thisPoll, pollDuration, client);
        } catch (err) {
          console.log(err);
          message.reply("An error occured");
        }
      }
    );
  }
}

const handleRolePoll = async (
  message: any,
  args: any[],
  thisPoll: pollType,
  pollDuration: any,
  client: Client
) => {
  const embed = createPollEmbed(thisPoll, pollDuration);

  interface roleOptionType extends PollOption {
    role: Role;
  }

  const MessageEmbed = await message.channel.send(embed),
    rolesArr: Array<roleOptionType> = thisPoll.options.map((_: PollOption) => {
      const thisRole = message.guild.roles.cache.find(
        (role: Role) => role.id == _.id
      );
      return { ..._, role: thisRole };
    });

  rolesArr.filter((_: roleOptionType) => _.role);
  for (let option of rolesArr) await MessageEmbed.react(option.emoji);

  const checkReactionAndGetMember = async (
    user: any,
    reaction: MessageReaction
  ) => {
    if (user.bot || !reaction.message.guild) return;
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (reaction.message.channel.id === message.channel.id) {
      const thisPollOption: roleOptionType | undefined = rolesArr.find(
        (_: roleOptionType) => _.emoji == reaction.emoji.name
      );

      if (thisPollOption) {
        const members = await message.guild.members.fetch(),
          thisMember = members.get(user.id);

        return { thisMember, thisPollOption };
      }
    }
  };

  client.on("messageReactionAdd", async (reaction, user) => {
    const { thisMember, thisPollOption }: any = await checkReactionAndGetMember(
      user,
      reaction
    );

    if (thisMember && thisPollOption)
      thisMember.roles.add(thisPollOption.role).catch((err: any) => {
        console.log(err);
      });
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    const { thisMember, thisPollOption }: any = await checkReactionAndGetMember(
      user,
      reaction
    );

    if (thisMember && thisPollOption)
      thisMember.roles.remove(thisPollOption.role).catch((err: any) => {
        console.log(err);
      });
  });
};

const handlePollCommand = async (
  message: any,
  args: any[],
  thisPoll: pollType,
  pollDuration: any
) => {
  const embed = createPollEmbed(thisPoll, pollDuration);

  const MessageEmbed = await message.channel.send(embed);
  for (let option of thisPoll.options) await MessageEmbed.react(option.emoji);

  interface pollResultOption {
    count: number;
    text?: string;
    emoji?: string;
  }

  const sendResultsMessage = (embedMsg: any) => {
    embedMsg.channel.send(`
              ${thisPoll.content} Results:\n\n${Array.from(
      embedMsg.reactions.cache
    )
      .map(([key, _]: any) => {
        const obj: pollResultOption = {
          ...thisPoll.options.find((option: PollOption) => option.emoji == key),
          count: _.count as number,
        };
        return obj;
      })
      .sort((a: pollResultOption, b: pollResultOption) => b.count - a.count)
      .map((_: pollResultOption) => `${_.emoji} | ${_.text}: **${_.count}**`)
      .join("\n")}`);
  };

  if (!pollDuration) {
    if (thisPoll.hasDuration)
      setTimeout(() => {
        MessageEmbed.delete();
        sendResultsMessage(MessageEmbed);
      }, thisPoll.duration);
  } else
    setTimeout(() => {
      MessageEmbed.delete();
      sendResultsMessage(MessageEmbed);
    }, pollDuration.ms);
};

const createPollEmbed = (thisPoll: pollType, pollDuration: any) => {
  return new Discord.MessageEmbed()
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
      "Duration: " +
        (pollDuration?.formattedDuration
          ? pollDuration.formattedDuration
          : thisPoll.hasDuration
          ? msToTime(thisPoll.duration)
          : "Unspecified")
    );
};
