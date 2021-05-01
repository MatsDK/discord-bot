import { Client, Collection } from "discord.js";

export interface commandType {
  keyword: string;
  description: string;
  roles: {
    allRoles: boolean;
    consentedRoles: string[];
  };
  channels: {
    allChannels: boolean;
    allowedChannels: string[];
  };
  action: boolean;
  reply: any;
  id?: string;
  fileName?: string;
}

export interface channelsType {
  name: string;
  id: string;
}

export interface rolesType {
  id: string;
  name: string;
  color: number;
  rawPosition: number;
}

export interface createCmdBody {
  channels: string[];
  allChannels: boolean;
  roles: string[];
  allRoles: boolean;
  keyWord: string;
  description: string;
  reply: string;
}

export interface PollOption {
  text: string;
  emoji: string;
  id?: string;
}

export interface pollType {
  rolePoll: boolean;
  name: string;
  content: string;
  description: string;
  hasDuration: boolean;
  duration: number;
  id: string;
  options: Array<PollOption>;
}
