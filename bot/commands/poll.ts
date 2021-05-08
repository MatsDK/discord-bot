import { commandType, dbGuildType, PollOption, pollType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";
import Discord, { Client, MessageReaction, Role } from "discord.js";
import { isTimeStr, msToTime } from "../commandUtils/getTimeInMs";
import formatTime from "../commandUtils/getTimeInMs";
import guildBot from "../../server/db/models/guildBot";

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

          const dbGuild: dbGuildType = await guildBot.findOne({
            guildId: message.guild.id,
          });
          if (!dbGuild) return;

          const thisPoll: pollType | undefined = dbGuild.polls.find(
            (_: pollType) =>
              _.name.toLowerCase() === pollName.toLowerCase() ||
              _.id === pollName.toLowerCase()
          );
          if (!thisPoll) return message.reply("Poll not found");

          if (!thisPoll.rolePoll)
            handlePollCommand(message, thisPoll, pollDuration);
          else handleRolePoll(message, thisPoll, pollDuration, client);
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
  thisPoll: pollType,
  pollDuration: any,
  client: Client
) => {
  interface RoleOptionType extends PollOption {
    role: Role;
  }

  let rolesArr: Array<RoleOptionType> = thisPoll.options.map(
    (_: PollOption) => {
      const thisRole = message.guild.roles.cache.find(
        (role: Role) => role.id == _.id
      );
      return { text: _.text, emoji: _.emoji, id: _.id, role: thisRole };
    }
  );
  rolesArr = rolesArr.filter((_: RoleOptionType) => !!_.role);

  const embed = createPollEmbed(thisPoll, rolesArr, pollDuration),
    MessageEmbed = await message.channel.send(embed);

  rolesArr = rolesArr.filter((_: RoleOptionType) => !!_.role);

  for (let option of rolesArr) await MessageEmbed.react(option.emoji);

  const checkReactionAndGetMember = async (
    user: any,
    reaction: MessageReaction
  ) => {
    if (user.bot || !reaction.message.guild) return;
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial) await reaction.fetch();

    if (reaction.message.channel.id === message.channel.id) {
      const thisPollOption: RoleOptionType | undefined = rolesArr.find(
        (_: RoleOptionType) => _.emoji == reaction.emoji.name
      );

      if (thisPollOption) {
        const members = await message.guild.members.fetch(),
          thisMember = members.get(user.id);

        return { member: thisMember, thisPollOption };
      }
    }
  };

  client.on("messageReactionAdd", async (reaction, user) => {
    const thisMember: any = await checkReactionAndGetMember(user, reaction);

    if (thisMember?.member && thisMember?.thisPollOption)
      thisMember.member.roles
        .add(thisMember.thisPollOption.role)
        .catch((err: any) => {
          console.log(err);
        });
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    const thisMember: any = await checkReactionAndGetMember(user, reaction);

    if (thisMember?.member && thisMember?.thisPollOption)
      thisMember.member.roles
        .remove(thisMember.thisPollOption.role)
        .catch((err: any) => {
          console.log(err);
        });
  });
};

const handlePollCommand = async (
  message: any,
  thisPoll: pollType,
  pollDuration: any
) => {
  const embed = createPollEmbed(thisPoll, thisPoll.options, pollDuration);

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

const createPollEmbed = (
  thisPoll: pollType,
  options: any[],
  pollDuration: any
) => {
  return new Discord.MessageEmbed()
    .setTitle(thisPoll.content)
    .setDescription(
      `
           ${thisPoll.description}\n
            ${options
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
