require("dotenv").config();
import next from "next";
import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiRouter from "./routers/apiRouter";
import { Bot } from "../bot/Bot";
import { NextServer } from "next/dist/server/next";

const dev: boolean = process.env.NODE_ENV !== "production";
const app: NextServer = next({ dev });
const handle = app.getRequestHandler();

// import polls from "../bot/poll.json";
// console.log(JSON.stringify(polls));

app
  .prepare()
  .then(() => {
    const server: Application = express();

    server.use(bodyParser());
    server.use(cors());
    server.use("/api", apiRouter);

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

const thisClient: Bot = new Bot(process.env.DC_BOT_TOKEN || "");
thisClient.start();
