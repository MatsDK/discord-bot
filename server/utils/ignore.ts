import { clientState } from "../../bot/client";
import { setIgnoredChannels, setIgnoredUsers } from "../../bot/states";
import { clientGuildObj } from "../../bot/types";

export const removeChannels = (
  channels: string[],
  guildId: string
): Array<{ id: string; name: string }> | { err: string } => {
  const thisGuildIgnoredChannels: clientGuildObj =
    clientState.client.guildObjs.get(guildId);
  if (!thisGuildIgnoredChannels) return { err: "cannot find guild" };

  const guild = clientState.client.guilds.cache.get(guildId);
  if (!guild) return { err: "server not found" };

  const newIgnoredChannels = thisGuildIgnoredChannels.ignoredChannels.filter(
    (_: string) => !channels.includes(_)
  );

  setIgnoredChannels(guildId, newIgnoredChannels);

  const newIgnoredChannelsArr = getIgnoredChannels(newIgnoredChannels, guild);
  return newIgnoredChannelsArr;
};

export const getIgnoredChannels = (
  ignoredIds: string[],
  guild: any
): { id: string; name: string }[] => {
  return ignoredIds
    .map((_: string) =>
      guild.channels.cache.find((channel: any) => channel.id === _)
    )
    .filter((_: any) => _)
    .map((_: any) => ({ name: _.name, id: _.id }));
};

export const removeMembers = async (members: string[], guildId: string) => {
  const thisGuildObj: clientGuildObj =
    clientState.client.guildObjs.get(guildId);
  if (!thisGuildObj) return { err: "Guild not found" };

  const guild = clientState.client.guilds.cache.get(guildId);
  if (!guild) return { err: "Guild not found" };

  const newIgnoredMembers = thisGuildObj.ignoredUsers.filter(
    (_: string) => !members.includes(_)
  );

  setIgnoredUsers(guildId, newIgnoredMembers);

  const newIgnoredMembersArr = await getIgnoredMembers(
    newIgnoredMembers,
    guild
  );
  return newIgnoredMembersArr;
};

export const getIgnoredMembers = async (
  membersIds: string[],
  guild: any
): Promise<Array<{ name: string; id: string }>> => {
  const members = await guild.members.fetch();

  return membersIds
    .map((_: string) => members.find((member: any) => member.id === _))
    .filter((_: any) => _)
    .map((_: any) => ({ name: _.user.tag, id: _.id }));
};

export const removeBanned = async (members: string[], guildId: string) => {
  const guild = clientState.client.guilds.cache.get(guildId);
  if (!guild) return { err: "Guild not found" };

  try {
    for (const member of members) {
      const user = await clientState.client.users.fetch(member);
      if (user) await guild.members.unban(user, "Unspecified");
    }

    const newBannedMembers = await guild.fetchBans();
    console.log(newBannedMembers);
    return getBannedMembers(newBannedMembers);
  } catch (e) {
    return { err: "can't unban" };
  }
};

export const getBannedMembers = (members: Map<string, any>) =>
  Array.from(members).map(([userId, _]) => {
    const { reason, user } = _;
    return { name: user.tag, id: userId, reason, img: user.avatarURL() };
  });
