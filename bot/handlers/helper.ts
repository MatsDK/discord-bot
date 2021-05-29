import { clientGuildObj, dbGuildType } from "bot/types";

export default (thisDbGuild: dbGuildType): clientGuildObj => {
  return {
    isActive: thisDbGuild.isActive,
    prefix: thisDbGuild.prefix,
    defaultMuteDuration: thisDbGuild.defaultMuteDuration,
    defaultBanDuration: thisDbGuild.defaultBanDuration,
    ignoredChannels: thisDbGuild.ignoredChannels,
    ignoredUsers: thisDbGuild.ignoredUsers,
    guildId: thisDbGuild.guildId,
    mutedRoleId: thisDbGuild.mutedRoleId,
    memberRoleId: thisDbGuild.memberRoleId,
    modeRolesIds: thisDbGuild.modeRolesIds,
  };
};
