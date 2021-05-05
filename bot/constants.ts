import conf from "./conf.json";
import fs from "fs";
import path from "path";

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
