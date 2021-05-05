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
    super({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

    if (!token?.trim()) throw "Invalid Login Token";
    this.#token = token;
    clientState.setClient(this);
  }

  #setCommands = () => {
    commandHandler(this, Discord);
  };

  #setEvents = () => {
    eventHandler(this, Discord);
  };

  async start() {
    await this.login(this.#token);

    this.#setCommands();
    this.#setEvents();
  }
}
