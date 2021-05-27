import axios from "axios";
import { commandType } from "../bot/types";
import Link from "next/link";
import React, { useState } from "react";
import UpdatePrefixForm from "src/components/UpdatePrefixForm";
import Layout from "src/components/Layout";

const HomePage = ({ cmds, prefix, imgURL }) => {
  const [Prefix, setPrefix] = useState<string>(prefix);
  const [commands] = useState<commandType[]>(
    Object.keys(cmds).map((cmdName: string) => cmds[cmdName])
  );

  return (
    <Layout guildData={{ img: imgURL }}>
      {/* <img src={imgURL} alt="avatar" /> */}
      <Link href={"/commands/new/"}>New Command</Link>
      <Link href={"/poll"}>Poll</Link>
      <Link href={"/ignored"}>Ignored / banned</Link>
      <UpdatePrefixForm
        initialPrefix={prefix}
        prefix={Prefix}
        setPrefix={setPrefix}
      />
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
                {Prefix}
                {_.keyword}
              </p>
              <p className="desc">{_.description}</p>
              <Link href={`/commands/edit/${_.id}`}>Edit</Link>
            </div>
          );
        })}
    </Layout>
  );
};

export async function getServerSideProps(context: any) {
  const res = await axios({
    method: "GET",
    url: "http://localhost:3001/api/getData",
  }).catch((err) => {
    console.log(err);
  });

  if (!res || res.data.err) return { props: { cmds: {}, prefix: "" } };
  return {
    props: {
      cmds: res.data.data.commands,
      prefix: res.data.data.prefix,
      imgURL: res.data.data.imgURL,
    },
  };
}

export default HomePage;
