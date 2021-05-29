import axios from "axios";
import { commandType, guildDataObj } from "../../bot/types";
import Link from "next/link";
import React, { useState } from "react";
import UpdatePrefixForm from "../../src/components/UpdatePrefixForm";
import Layout from "../../src/components/Layout";
import { useRouter } from "next/router";

interface HomePageProps {
  cmds: { [key: string]: commandType };
  prefix: string;
  data: guildDataObj;
}

const HomePage: React.FC<HomePageProps> = ({ cmds, prefix, data }) => {
  const [Prefix, setPrefix] = useState<string>(prefix);
  const [commands] = useState<commandType[]>(
    Object.keys(cmds).map((cmdName: string) => cmds[cmdName])
  );
  const router = useRouter();
  const { guildId } = router.query;

  return (
    <Layout guildData={data}>
      <Link href={`/${guildId}/commands/new/`}>New Command</Link>
      <Link href={`/${guildId}/poll`}>Poll</Link>
      <Link href={`/${guildId}/ignored`}>Ignored / banned</Link>
      <UpdatePrefixForm
        guildId={guildId as string}
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
              <Link href={`/${guildId}/commands/edit/${_.id}`}>Edit</Link>
            </div>
          );
        })}
    </Layout>
  );
};

export const getServerSideProps = async (context: any) => {
  const res = await axios({
    method: "GET",
    params: { guildId: context.query.guildId },
    url: "http://localhost:3001/api/getData",
  }).catch((err) => {
    console.log(err);
  });

  if (!res || res.data.err) return { redirect: { destination: "/" } };
  return {
    props: {
      cmds: res.data.data.commands,
      prefix: res.data.data.prefix,
      data: res.data.data.data,
    },
  };
};

export default HomePage;
