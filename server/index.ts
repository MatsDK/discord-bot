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

const dev: boolean = process.env.NODE_ENV !== "production";
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

// const setDb = new guildBot({
//   setup: true,
//   guildId: "831144092435218432",
//   isActive: true,
//   prefix: "!",
//   defaultBanDuration: 7,
//   defaultMuteDuration: 86400000,
//   mutedRoleId: "832604586304602162",
//   memberRoleId: "832925646173896734",
//   modeRoleId: "831232473144754307",
//   ignoredChannels: ["833080267068538880", "831519957372239912"],
//   ignoredUsers: [],
//   polls: [
//     {
//       rolePoll: false,
//       name: "country",
//       content: "Where are you from",
//       description: "ask where they are from",
//       hadDuration: false,
//       duration: 0,
//       id: "a6EN28VIw4rYbO9aN-XzX",
//       options: [
//         { text: "netherlands", emoji: "🇳🇱" },
//         { text: "Belgium", emoji: "🇧🇪" },
//         { text: "Luxembourg", emoji: "🇱🇺" },
//         { text: "China", emoji: "🇨🇳" },
//         { text: "Japan", emoji: "🇯🇵" },
//         { text: "Somalia", emoji: "🇸🇴" },
//       ],
//     },
//     {
//       rolePoll: true,
//       name: "language",
//       content: "what is your language",
//       description: "ask language",
//       hadDuration: false,
//       duration: 0,
//       id: "JOh_EaR4YRQ3B55sITb2j",
//       options: [
//         { text: "dutch", emoji: "🇳🇱", id: "838006134605873172" },
//         { text: "japanese", emoji: "🇯🇵", id: "838006400214368256" },
//         { text: "french", emoji: "🇲🇫", id: "832604586304602162" },
//       ],
//       desriptions: "ask language",
//     },
//   ],
//   commands: [
//     {
//       keyword: "youtube",
//       description: "Youtube Link",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: false,
//       reply: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//       id: "BCxXDN6GQZpaQZ1aKWMtF",
//     },
//   ],
//   actions: [
//     {
//       keyword: "clear",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       description: "Clear messages",
//       reply: "",
//       id: "awtHboWksssiS3C8hcqS",
//       action: true,
//       fileName: "clear.ts",
//     },
//     {
//       keyword: "ban",
//       roles: { allRoles: false, consentedRoles: ["831232420425498675"] },
//       channels: {
//         allChannels: false,
//         allowedChannels: ["831519957372239912", "833080267068538880"],
//       },
//       description: "Ban a member",
//       reply: "",
//       id: "awtHboWkr4khiS3C8hcqS",
//       action: true,
//       fileName: "ban.ts",
//     },
//     {
//       keyword: "ping",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "e3gZU3hIXFDr4P_JnKzSf9",
//       fileName: "ping.ts",
//     },
//     {
//       keyword: "commands",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "List commands for role",
//       reply: "",
//       id: "wwxbuwBLwgrO--lcvAYSbeG",
//       fileName: "commands.ts",
//     },
//     {
//       keyword: "create_poll",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "dbZVu-ducj01xqSDouRfT",
//       fileName: "createpoll.ts",
//     },
//     {
//       keyword: "flip",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "or29OAcrJF1qLf9TgFnz7ejj",
//       fileName: "flip.ts",
//     },
//     {
//       keyword: "kick",
//       roles: { allRoles: false, consentedRoles: ["831232420425498675"] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "xbuwBLwgrO--lcvAYSbeG",
//       fileName: "kick.ts",
//     },
//     {
//       keyword: "members",
//       roles: { allRoles: false, consentedRoles: ["831232420425498675"] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "wxbuwBLwgrO--lcvAYSbeG",
//       fileName: "members.ts",
//     },
//     {
//       keyword: "mute",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "rsBaOGbD8m2FPhx19_NOf",
//       fileName: "mute.ts",
//     },
//     {
//       keyword: "nickname",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "or29OAcrJF1qLf9TgFnz7",
//       fileName: "nickname.ts",
//     },
//     {
//       keyword: "prefix",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "3gZU3hIXFDr4P_JnKzSf9",
//       fileName: "prefix.ts",
//     },
//     {
//       keyword: "role",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831165194603462727"],
//       },
//       channels: {
//         allChannels: false,
//         allowedChannels: ["831144092435218435"],
//       },
//       action: true,
//       description: "",
//       reply: "",
//       id: "2qA_U1NWJf3X4Z_zK_HgC",
//       fileName: "role.ts",
//     },
//     {
//       keyword: "roles",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "",
//       reply: "",
//       id: "BctIqW8XUfwDMxVXmTPFi",
//       fileName: "roles.ts",
//     },
//     {
//       keyword: "rps",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Play rock paper scissors with the bot.",
//       reply: "",
//       id: "xbuwBLwgrO--lcvAYSdbeG",
//       fileName: "rps.ts",
//     },
//     {
//       keyword: "unban",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Unban banned user",
//       reply: "",
//       id: "PDdER0-XF0La0hZ1NHojg",
//       fileName: "unban.ts",
//     },
//     {
//       keyword: "unmute",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Unmute muted user",
//       reply: "",
//       id: "VVaFAd_yvYyNc3h3oTYLQ",
//       fileName: "unmute.ts",
//     },
//     {
//       keyword: "poll",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "ask poll",
//       reply: "",
//       id: "94HaSyfs_jZnBDwyN9j",
//       fileName: "poll.ts",
//     },
//     {
//       keyword: "announce",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: {
//         allChannels: false,
//         allowedChannels: ["831144092435218435"],
//       },
//       description: "Announce",
//       reply: "",
//       id: "VfwwdsVaFAd_yvYyNc3h3oTYLQ",
//       action: true,
//       fileName: "announce.ts",
//     },
//     {
//       keyword: "channel",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "create channels",
//       reply: "",
//       id: "R0ZrO_dFoYVqPR7d0NTMe",
//       fileName: "channel.ts",
//     },
//     {
//       keyword: "avatar",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675", "831232473144754307"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Show users avatar",
//       reply: "",
//       id: "wwaFAd_yvYyNc3h3oTYL",
//       fileName: "avatar.ts",
//     },
//     {
//       keyword: "mentionable",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Toggle if roles is mentionable",
//       reply: "",
//       id: "ur3riSCKU1vtgHRoMWial",
//       fileName: "mentionable.ts",
//     },
//     {
//       keyword: "leave",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Leave this server",
//       reply: "",
//       id: "wxbuwBLwgrO--lcvAYSdbeG",
//       fileName: "leave.ts",
//     },
//     {
//       keyword: "setcolor",
//       roles: { allRoles: true, consentedRoles: [] },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Set color of role",
//       reply: "",
//       id: "wxwBLwgrO--lcvAYSdbeG",
//       fileName: "setcolor.ts",
//     },
//     {
//       keyword: "polls",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "List all polss",
//       reply: "",
//       id: "wxwwBLwgrO--lcvAYSdbeG",
//       fileName: "polls.ts",
//     },
//     {
//       keyword: "ignorechannel",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Ignore command usage in specified channels ",
//       reply: "",
//       id: "bjdssjIQ8JbkurdnWUwru",
//       fileName: "ignorechannel.ts",
//     },
//     {
//       keyword: "ignored",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "List ignored channels",
//       reply: "",
//       id: "sJUTAYaO583-yWqmjtZ24",
//       fileName: "ignored.ts",
//     },
//     {
//       keyword: "ignoreuser",
//       roles: {
//         allRoles: false,
//         consentedRoles: ["831232420425498675"],
//       },
//       channels: { allChannels: true, allowedChannels: [] },
//       action: true,
//       description: "Ignore user",
//       reply: "",
//       id: "wsJUTAYaO583-yWqmjtZ24",
//       fileName: "ignoreuser.ts",
//     },
//   ],
// });

// setDb.save();

const thisClient: Bot = new Bot(process.env.DC_BOT_TOKEN || "");
thisClient.start();
