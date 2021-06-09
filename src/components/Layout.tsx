import { useRef, useState } from "react";
import styles from "../css/Layout.module.css";
import { ScrollToTopBtn } from "./icons";
import Sidebar from "./Sidebar";
import Head from "next/head";

const Layout: React.FC<{ guildData: any }> = ({ children, guildData }) => {
  const [showScrollToTopButton, setShowScrollToTopButton] =
    useState<boolean>(false);
  const pageContent = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    pageContent.current?.scroll({ top: 0 });
  };

  const scroll = () => {
    setShowScrollToTopButton(pageContent.current?.scrollTop != 0);
  };

  return (
    <div className={styles.main_container}>
      <Head>
        <title>{guildData.thisGuild.name || "Server"}</title>
      </Head>
      <Sidebar guildData={guildData} />
      <div ref={pageContent} onScroll={scroll} className={styles.page_content}>
        {children}
      </div>
      <div
        className={`${styles.scrollToTopBtn} ${
          showScrollToTopButton && styles.active
        }`}
        onClick={scrollToTop}
      >
        <ScrollToTopBtn />
      </div>
    </div>
  );
};

export default Layout;
