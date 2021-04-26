import Link from "next/link";
import { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

const customEmojis = [
  {
    name: "Octocat",
    short_names: ["octocat"],
    text: "",
    emoticons: [],
    keywords: ["github"],
    imageUrl: "https://github.githubassets.com/images/icons/emoji/octocat.png",
    customCategory: "GitHub",
  },
  {
    name: "Test Flag",
    short_names: ["test"],
    text: "",
    emoticons: [],
    keywords: ["test", "flag"],
    spriteUrl:
      "https://unpkg.com/emoji-datasource-twitter@4.0.4/img/twitter/sheets-256/64.png",
    // sheet_x: 1,
    // sheet_y: 1,
    // size: 64,
    // sheetColumns: 52,
    // sheetRows: 52,
    customCategory: "GitHub",
  },
];

const PollPage = () => {
  // const [chosenEmoji, setChosenEmoji] = useState<any>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  // const onEmojiClick = (event, emojiObject) => {
  //   setChosenEmoji(emojiObject);
  // };

  return (
    <div>
      <Link href="/poll">Polls</Link>
      <Link href="/">Home</Link>
      new poll
      {emojiPickerOpen && (
        <Picker
          theme="dark"
          custom={customEmojis}
          onSelect={(e) => {
            console.log(e);
          }}
          include={[]}
        />
      )}
      <button onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>open</button>
    </div>
  );
};

export default PollPage;
