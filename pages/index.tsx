import axios from "axios";
import { commandType } from "bot/types";
import NewCommandForm from "components/newCommandForm";
import React, { useState } from "react";

const Index = ({ cmds, prefix }): JSX.Element => {
  const [commands, setCommands] = useState<commandType[]>(
    Object.keys(cmds).map((cmdName: string) => cmds[cmdName])
  );

  return (
    <div>
      <NewCommandForm prefix={prefix} setCommands={setCommands} />
      {commands.reverse().map((_: commandType, idx: number) => {
        return (
          <div key={idx} style={{ display: "flex" }}>
            <p className="keyWord">
              {prefix}
              {_.keyword}
            </p>
            <p className="desc">{_.description}</p>
            <p className="reply">{_.reply}</p>
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
    props: { cmds: res.data.data.commands, prefix: res.data.data.prefix },
  };
};

export default Index;
