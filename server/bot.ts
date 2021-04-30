import { Bot } from "../bot/Bot";
require("dotenv").config();

const thisClient: Bot = new Bot(process.env.DC_BOT_TOKEN || "");
thisClient.start();
