import getTimeInMs from "./utils/getTimeInMs";
import conf from "../conf.json";
import Discord from "discord.js";

export default {
  name: "mute",
  async execute(client: any, message: any, args: any) {
    const target: any = message.mentions.members.first();
    if (!target) message.reply("Please mention the person you want to mute");
    if (target.user.bot) return message.reply("You can't mute a bot");

    if (target.id == message.author.id)
      return message.reply("You can't mute yourself");

    if (!message.member.hasPermission("MUTE_MEMBERS"))
      return message.reply(
        "You don't have enough permissions to use this command"
      );

    const mutedRole = message.guild.roles.cache.find(
      (role: any) => role.name === "Muted"
    );
    if (!mutedRole) message.reply("There is no Muted role on this server");

    const memberRole = message.guild.roles.cache.find(
      (role: any) => role.name === "Member"
    );
    if (!memberRole) message.reply("There is no Member role on this server");

    if (target.roles.cache.has(mutedRole.id))
      return message.reply("Member is already muted");

    target.roles.remove(memberRole);
    target.roles.add(mutedRole);

    let timeInMs: any = getTimeInMs(args[1]?.trim()),
      reason: string = "";
    if (timeInMs >= 604800000) return message.reply("Max mute time is 7 days");

    if (timeInMs.err) {
      setTimeout(() => {
        target.roles.remove(mutedRole);
        target.roles.add(memberRole);
      }, conf.defaultMuteDuration);
      reason = args.slice(1).join(" ") || "Unspecified";
    } else {
      setTimeout(() => {
        target.roles.remove(mutedRole);
        target.roles.add(memberRole);
      }, timeInMs.ms);
      reason = args.slice(2).join(" ") || "Unspecified";
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(`Muted ${target.user.username}`)
      .setDescription(
        `Duration: ${timeInMs.formattedDuration || 0} \n Reason: ${reason}`
      )
      .setFooter(`Muted By ${message.author.username}`);

    message.channel.send(embed);
  },
};
