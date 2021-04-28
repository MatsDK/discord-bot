import axios from "axios";
import { commandType } from "@/bot/types";
import Link from "next/link";
import React, { useState } from "react";

const Index = ({ cmds, prefix }): JSX.Element => {
  const [commands] = useState<commandType[]>(
    Object.keys(cmds).map((cmdName: string) => cmds[cmdName])
  );

  return (
    <div>
      <Link href={"/commands/new/"}>New Command</Link>
      <Link href={"/poll"}>Poll</Link>
      {commands
        .sort((a: commandType, b: commandType) => {
          const textA = a.keyword.toUpperCase();
          const textB = b.keyword.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        })
        .map((_: commandType, idx: number) => {
          return (
            <div key={idx} style={{ display: "flex" }}>
              <p className="keyWord">
                {prefix}
                {_.keyword}
              </p>
              <p className="desc">{_.description}</p>
              <Link href={`/commands/edit/${_.id}`}>Edit</Link>
            </div>
          );
        })}
    </div>
  );
};

export const getStaticProps = async () => {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/getData",
  });

  if (res.data.err) return { props: { data: {} } };
  return {
    props: {
      cmds: res.data.data.commands,
      prefix: res.data.data.prefix,
    },
  };
};

export default Index;
