export default (
  target: any,
  message: any,
  args: any[]
): { err: string | boolean } => {
  if (!target) return { err: `Please mention the person who you want to kick` };

  if (target.id === message.author.id)
    return { err: "You cannot kick yourself" };

  if (!message.member.hasPermission("KICK_MEMBERS"))
    return { err: "You do not have enough permission to use this command" };

  if (!message.guild.me.hasPermission("KICK_MEMBERS"))
    return { err: "I do not have enough permissions. to use this command" };

  if (!args[1]) return { err: "Please give a reason to ban" };

  return { err: false };
};
