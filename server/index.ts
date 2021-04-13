require("dotenv").config();
import next from "next";
import Discord from "discord.js";
import { commandHandler } from "./handlers/commandHandler";
import { eventHandler } from "./handlers/eventHandler";
import { clientState } from "./client";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server: Application = express();

    server.use(bodyParser());
    server.use(cors());

    server.get("/api/getData", async (req: Request, res: Response) => {
      const { default: commands } = await import("./commands/commands.json");
      res.json({ err: false, data: commands });
    });

    server.get("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(3001, (err?: any): void => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${3001}`);
    });
  })
  .catch((ex: any) => {
    console.error(ex.stack);
    process.exit(1);
  });

const client: any = new Discord.Client();
clientState.setClient(client);

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

commandHandler(client, Discord);
eventHandler(client, Discord);

client.login(process.env.DC_BOT_TOKEN);
