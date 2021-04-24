import Discord, { Client, Collection } from "discord.js";
import { clientState } from "./client";
import { commandHandler } from "./handlers/commandHandler";
import { eventHandler } from "./handlers/eventHandler";
import { commandType } from "./types";

export class Bot extends Client {
  #token: string;
  commands: Collection<string, commandType> = new Collection();
  events: Collection<string, Function> = new Collection();

  constructor(token: string) {
    super();

    if (!token?.trim()) throw "Invalid Login Token";
    this.#token = token;
    clientState.setClient(this);

    this.#setCommands();
    this.#setEvents();
  }

  #setCommands = () => {
    commandHandler(this, Discord);
  };

  #setEvents = () => {
    eventHandler(this, Discord);
  };

  start() {
    this.login(this.#token);
  }
}
