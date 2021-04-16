import conf from "./conf.json";
import fs from "fs";
import path from "path";

export const prefixState = {
  PREFIX: conf.prefix,
  setPrefix: (newPrefix: string) => {
    prefixState.PREFIX = newPrefix;
    conf.prefix = newPrefix;

    fs.writeFileSync(
      path.resolve(__dirname, "./conf.json"),
      JSON.stringify(conf),
      null
    );
  },
};
