import { commandType } from "../types";

type executeFunc = (client: any, message: any, args: any[]) => any;
export interface CommandClass extends commandType {
  execute: executeFunc;
}

export class Command implements CommandClass {
  execute: executeFunc;
  keyword: string;
  roles: {
    allRoles: boolean;
    consentedRoles: Array<string>;
  };
  channels: {
    allChannels: boolean;
    allowedChannels: Array<string>;
  };
  action: boolean;
  description: string;
  reply: string;
  id: string;

  constructor(cmdDetails: commandType, execute) {
    this.execute = execute;
    this.keyword = cmdDetails.keyword;
    this.roles = cmdDetails.roles;
    this.channels = cmdDetails.channels;
    this.description = cmdDetails.description;
    this.reply = cmdDetails.reply;
    this.id = cmdDetails.id || "";
    this.action = true;
  }
}
