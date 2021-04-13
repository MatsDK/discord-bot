import fs from "fs";
import path from "path";

export const commandHandler = async (client: any, Discord: any) => {
  const commandFiles = fs
    .readdirSync(path.resolve(__dirname, "../commands"))
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const { default: command } = await import(`../commands/${file}`);

    if (command.name) client.commands.set(command.name, command);
    else continue;
  }
};
