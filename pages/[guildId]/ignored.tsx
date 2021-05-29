import axios from "axios";
import { Context } from "node:vm";
import Router from "next/router";
import Layout from "../../src/components/Layout";
import { guildDataObj } from "bot/types";
import styles from "../../src/css/ignoredPage.module.css";
import { RemoveIcon } from "src/components/icons";
import { useRouter } from "next/router";
import { useState } from "react";

type ignoredChannel = { name: string; id: string };
type bannedMember = { name: string; id: string; reason: string; img: string };
type ignoredUser = { name: string; id: string };

interface nextFunctionComponent<P = {}> extends React.FC<P> {
  getInitialProps?: (ctx: any) => Promise<P>;
}

interface IgnoredPageProps {
  ignoredChannels: Array<ignoredChannel>;
  bannedMembers: Array<bannedMember>;
  ignoredUsers: Array<ignoredUser>;
  guildData: guildDataObj;
}

type ItemType = { name: string; id: string };
type removeItemProps = {
  ignoredChannelsArr?: string[];
  ignoredMembersArr?: string[];
  bannedMembersArr?: string[];
};

const Ignored: nextFunctionComponent<IgnoredPageProps> = (props) => {
  const [ignoredChannels, setIgnoredChannels] = useState<ItemType[]>(
    props.ignoredChannels
  );
  const [ignoredMembers, setIgnoredMembers] = useState<ItemType[]>(
    props.ignoredUsers
  );
  const [bannedMembers, setBannedMembers] = useState<bannedMember[]>(
    props.bannedMembers
  );
  const router = useRouter();

  const remove = ({
    ignoredChannelsArr = [],
    ignoredMembersArr = [],
    bannedMembersArr = [],
  }: removeItemProps) => {
    axios({
      method: "POST",
      url: "http://localhost:3001/api/changeIgnored",
      data: {
        removeIgnoredChannels: ignoredChannelsArr,
        removeIgnoredMembers: ignoredMembersArr,
        removeBannedMembers: bannedMembersArr,
        guildId: router.query.guildId,
      },
    }).then((res) => {
      if (res.data.err) return alert(res.data.err);
      setIgnoredChannels(res.data.ignoredChannels || []);
      setIgnoredMembers(res.data.ignoredMembers || []);
      setBannedMembers(res.data.bannedMembers || []);
    });
  };
  return (
    <Layout guildData={props.guildData}>
      <div className={styles.ignoredPageHeader}>
        <h1>Ignored</h1>
      </div>
      <div className={styles.ignoredContainers}>
        <div className={styles.container}>
          <div className={styles.containerHeader}>
            <span>Ignored Channels</span>
          </div>
          <div className={styles.containerContent}>
            {ignoredChannels.map((_: ignoredChannel, idx: number) => {
              return (
                <div key={idx}>
                  <p>{_.name}</p>
                  <div
                    onClick={() => remove({ ignoredChannelsArr: [_.id] })}
                    className={styles.containerRemoveButton}
                  >
                    <RemoveIcon />
                  </div>
                </div>
              );
            })}
            {ignoredChannels.length === 0 && (
              <p className={styles.noItems}>No Ignored Channels</p>
            )}
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.containerHeader}>
            <span>Ignored Members</span>
          </div>
          <div className={styles.containerContent}>
            {ignoredMembers.map((_: ignoredUser, idx: number) => {
              return (
                <div key={idx} style={{ display: "flex" }}>
                  <p>{_.name}</p>
                  <div
                    onClick={() => remove({ ignoredMembersArr: [_.id] })}
                    className={styles.containerRemoveButton}
                  >
                    <RemoveIcon />
                  </div>
                </div>
              );
            })}
            {ignoredMembers.length === 0 && (
              <p className={styles.noItems}>No Ignored Members</p>
            )}
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.containerHeader}>
            <span>Banned Members</span>
          </div>
          <div className={styles.containerContent}>
            {bannedMembers.map((_: bannedMember, idx: number) => {
              return (
                <div key={idx} style={{ display: "flex" }}>
                  <p>{_.name}</p>
                  <p>{_.reason}</p>
                  <div
                    onClick={() => remove({ bannedMembersArr: [_.id] })}
                    className={styles.containerRemoveButton}
                  >
                    <RemoveIcon />
                  </div>
                </div>
              );
            })}
            {bannedMembers.length === 0 && (
              <p className={styles.noItems}>No Banned Members</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

Ignored.getInitialProps = async ({ res, query }: Context) => {
  const apiRes = await axios({
    method: "GET",
    params: { guildId: query.guildId },
    url: "http://localhost:3001/api/ignored",
  }).catch((err) => {
    console.log(err);
  });

  if (!apiRes || apiRes.data.err) {
    if (typeof window === "undefined") return res.redirect("/");
    else return Router.push("/");
  }
  return {
    ignoredChannels: apiRes.data.ignoredChannels,
    bannedMembers: apiRes.data.bannedMembers,
    ignoredUsers: apiRes.data.ignoredUsers,
    guildData: apiRes.data.guildData,
  };
};
export default Ignored;
