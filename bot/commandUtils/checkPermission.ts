export default (
  target: any,
  message: any,
  action: string
): { err: string | boolean } => {
  if (!target) return { err: `Please mention a person` };

  if (target.id === message.author.id)
    return {
      err: `You cannot ${
        action === "BAN_MEMBERS" ? "ban or unban" : "kick"
      }  yourself`,
    };

  if (!message.member.hasPermission(action))
    return { err: "You do not have enough permission to use this command" };

  if (!message.guild.me.hasPermission(action))
    return {
      err: "This bot doesn't have enough permissions to use this command",
    };

  return { err: false };
};
