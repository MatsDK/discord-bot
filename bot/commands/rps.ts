import Discord from "discord.js";
import { commandType } from "../types";
import { Command, CommandClass } from "../commandUtils/Command";

export class CommandConstructor {
  command: CommandClass;

  constructor(cmdDetails: commandType) {
    this.command = new Command(
      cmdDetails,
      async (client: any, message: any, args: any[]) => {
        try {
          const userChoice: string = args[0]?.trim().toLowerCase();
          if (!userChoice) return message.reply("Enter your choice");

          const possibleInputs: Array<string[]> = [
            ["rock", "r"],
            ["paper", "p"],
            ["scissors", "s"],
          ];

          const convertAnswers = (idx: number): string => {
            return (
              possibleInputs[idx][0].charAt(0).toUpperCase() +
              possibleInputs[idx][0].slice(1)
            );
          };

          const userIdx: number = possibleInputs.findIndex((_: string[]) =>
            _.includes(userChoice)
          );
          const botIdx: number = Math.round(Math.random() * 2);
          if (userIdx < 0) return message.reply("Invalid choice");

          let res: string = botIdx === userIdx ? "Tie" : "";
          if (userIdx === 0) {
            if (botIdx === 1) res = "You lose";
            if (botIdx === 2) res = "You win";
          } else if (userIdx === 1) {
            if (botIdx === 0) res = "You win";
            if (botIdx === 2) res = "You lose";
          } else if (userIdx === 2) {
            if (botIdx === 0) res = "You lose";
            if (botIdx === 1) res = "You win";
          }

          const embed = new Discord.MessageEmbed()
            .setTitle("Rock Paper Scissors")
            .setDescription(
              `You chose:  \` ${convertAnswers(
                userIdx
              )} \` \nThe bot chose: \` ${convertAnswers(
                botIdx
              )} \` \n**${res}**`
            );
          message.reply(embed);
        } catch (err) {
          message.reply("An error occured");
        }
      }
    );
  }
}
