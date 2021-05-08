import { commandType } from "bot/types";

export const cmdExists = (
  thisGuildCommands: Map<string, any>,
  keyWord: string
): boolean => {
  const cmds: commandType[] = Array.from(thisGuildCommands).map(
    ([key, cmd]: any) => cmd
  );

  return (
    thisGuildCommands.get(keyWord.toLowerCase()) ||
    cmds.some(
      (_: commandType) => _.keyword.toLowerCase() === keyWord.toLowerCase()
    )
  );
};
