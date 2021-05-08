import { clientState } from "./client";
import guildBot from "../server/db/models/guildBot";
import { clientGuildObj, dbGuildType } from "./types";

export const setPrefix = async (guildId: string, newPrefix: string) => {
  try {
    const thisDbObj: dbGuildType = await guildBot.findOneAndUpdate(
      { guildId },
      { prefix: newPrefix }
    );
    if (!thisDbObj) return;
    thisDbObj.prefix = newPrefix;

    const thisGuildObj: clientGuildObj = clientState.client.guildObjs.get(
      guildId
    );
    if (!thisGuildObj) return;
    thisGuildObj.prefix = newPrefix;
  } catch (err) {
    console.log(err);
  }
};

export const setIgnoredChannels = async (
  guildId: string,
  newIgnoredChannels: string[]
) => {
  const thisDbObj: dbGuildType = await guildBot.findOneAndUpdate(
    { guildId },
    { ignoredChannels: newIgnoredChannels }
  );
  if (!thisDbObj) return;

  const thisGuildObj: clientGuildObj = clientState.client.guildObjs.get(
    guildId
  );
  if (!thisGuildObj) return;
  thisGuildObj.ignoredChannels = newIgnoredChannels;
};

export const setIgnoredUsers = async (
  guildId: string,
  newIgnoredUsers: string[]
) => {
  const thisDbObj: dbGuildType = await guildBot.findOneAndUpdate(
    { guildId },
    { ignoredUsers: newIgnoredUsers }
  );
  if (!thisDbObj) return;

  const thisGuildObj: clientGuildObj = clientState.client.guildObjs.get(
    guildId
  );
  if (!thisGuildObj) return;
  thisGuildObj.ignoredUsers = newIgnoredUsers;
};

export const COMMAND_OBJECT = {
  keyWord: "",
  roles: {
    allRoles: true,
    consentedRoles: [],
  },
  channels: {
    allChannels: true,
    allowedChannels: [],
  },
  action: false,
  description: "",
  reply: "",
  id: "",
};
