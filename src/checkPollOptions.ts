import { PollOption } from "@/bot/types";

export const checkPoll = (
  pollOptions: PollOption[],
  pollContentInput: string,
  pollNameInput: string
): { err: boolean | string } => {
  if (!pollNameInput.trim().length || !pollContentInput.trim().length)
    return { err: "Pleace provide a Name and Question" };

  if (pollOptions.length < 1) return { err: "Please provide options" };

  for (let option of pollOptions) {
    if (!option.text.trim().length || !option.emoji.trim().length)
      return { err: "Please provide an emoji and text for every option" };

    if (
      pollOptions.filter((_: PollOption) => _.emoji == option.emoji).length > 1
    )
      return { err: "You cannot use one emoji multiple times" };
  }

  return { err: false };
};
