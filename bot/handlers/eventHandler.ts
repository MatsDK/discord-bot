import fs from "fs";
import path from "path";

export const eventHandler = async (client: any, Discord: any) => {
   const loadDir = async (dirs: any) => {
      const eventsFiles = fs
         .readdirSync(path.resolve(__dirname, `../events/${dirs}`))
         .filter((file: string) => file.endsWith(".ts"));

      for (const file of eventsFiles) {
         const { default: event } = await import(`../events/${dirs}/${file}`);

         const eventName = file.split(".")[0];
         client.on(eventName, event.bind(null, Discord, client));
      }
   };

   ["client", "guild"].forEach((e: any) => loadDir(e));
};
