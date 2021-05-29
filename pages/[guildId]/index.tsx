import axios from "axios";
import { commandType, guildDataObj } from "../../bot/types";
import Link from "next/link";
import React, { useState } from "react";
import UpdatePrefixForm from "../../src/components/UpdatePrefixForm";
import Layout from "../../src/components/Layout";
import { useRouter } from "next/router";
import styles from "../../src/css/commandPage.module.css";
import { EditIcon, RemoveIcon } from "src/components/icons";

interface HomePageProps {
  cmds: { [key: string]: commandType };
  prefix: string;
  data: guildDataObj;
}

const HomePage: React.FC<HomePageProps> = ({ cmds, prefix, data }) => {
  const [Prefix, setPrefix] = useState<string>(prefix);
  const [showUpdatePrefixForm, setShowUpdatePrefixForm] =
    useState<boolean>(false);
  const [commands] = useState<commandType[]>(
    Object.keys(cmds).map((cmdName: string) => cmds[cmdName])
  );
  const router = useRouter();
  const { guildId } = router.query;

  return (
    <Layout guildData={data}>
      <div className={styles.pageHeader}>
        <h1>Commands</h1>
        <div>
          <button
            onClick={() => setShowUpdatePrefixForm(!showUpdatePrefixForm)}
          >
            Change Prefix
          </button>
          <Link href={`/${guildId}/commands/new`}>
            <button>New Command</button>
          </Link>
        </div>
      </div>
      {showUpdatePrefixForm && (
        <UpdatePrefixForm
          guildId={guildId as string}
          initialPrefix={prefix}
          prefix={Prefix}
          setPrefix={setPrefix}
        />
      )}
      <div className={styles.commandsListHeader}>
        <span style={{ width: "35%", textAlign: "start" }}>Keyword</span>
        <span style={{ textAlign: "start", flex: "1" }}>Description</span>
        <div style={{ width: "100px" }}></div>
      </div>
      <div className={styles.commandsList}>
        {commands
          .sort((a: commandType, b: commandType) => {
            const textA = a.keyword.toUpperCase();
            const textB = b.keyword.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
          })
          .map((_: commandType, idx: number) => {
            return (
              <div key={idx} className={styles.commandsListItem}>
                <p className={styles.keyWord}>
                  <span className={styles.prefix}>{Prefix}</span>
                  {_.keyword}
                </p>
                <span className={styles.description}>{_.description}</span>
                <div className={styles.buttonsWrapper}>
                  <RemoveIcon />
                  <Link href={`/${guildId}/commands/edit/${_.id}`}>
                    <p>
                      <EditIcon />
                    </p>
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
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
