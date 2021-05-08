require("dotenv").config();
import next from "next";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiRouter from "./routers/apiRouter";
import apiPollsRouter from "./routers/apiPollsRouter";
import { Bot } from "../bot/Bot";
import { NextServer } from "next/dist/server/next";
import { nanoid } from "nanoid";
import connectDb from "./db/db";

const dev: boolean = process.env.__DEV__ == "true";
const app: NextServer = next({ dev });
const handle = app.getRequestHandler();

console.log(nanoid());

app
  .prepare()
  .then(() => {
    const server: Application = express();

    server.use(bodyParser());
    server.use(cors());
    server.use("/api", apiRouter);
    server.use("/api/poll", apiPollsRouter);

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

connectDb();

const thisClient: Bot = new Bot(process.env.DC_BOT_TOKEN || "");
thisClient.start();
