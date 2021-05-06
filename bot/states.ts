import conf from "./conf.json";
import fs from "fs";
import path from "path";
import { clientState } from "./client";
import guildBot from "../server/db/models/guildBot";
import { clientGuildObj, dbGuildType } from "./types";

export const prefixState = {
  PREFIX: conf.prefix,
  setPrefix: (newPrefix: string) => {
    prefixState.PREFIX = newPrefix;
    conf.prefix = newPrefix;

    fs.writeFileSync(
      path.resolve(__dirname, "./conf.json"),
      JSON.stringify(conf),
      null
    );
  },
};

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

export const ignoredChannelsState = {
  IGNORED_CHANNELS: conf.ignoredChannels,
  setIgnoredChannels: (newIgnoredChannels: string[]) => {
    ignoredChannelsState.IGNORED_CHANNELS = newIgnoredChannels as never[];
    conf.ignoredChannels = newIgnoredChannels as never[];

    fs.writeFileSync(
      path.resolve(__dirname, "./conf.json"),
      JSON.stringify(conf),
      null
    );
  },
};

export const ignoredUsersState = {
  IGNORED_USERS: conf.ignoredUsers,
  setIgnoredUsers: (newIgnoredUsers: string[]) => {
    ignoredUsersState.IGNORED_USERS = newIgnoredUsers as never[];
    conf.ignoredUsers = newIgnoredUsers as never[];

    fs.writeFileSync(
      path.resolve(__dirname, "./conf.json"),
      JSON.stringify(conf),
      null
    );
  },
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
