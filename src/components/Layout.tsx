import styles from "../css/Layout.module.css";
import Siderbar from "./Siderbar";

const Layout: React.FC<{ guildData: any }> = ({ children, guildData }) => {
  return (
    <div className={styles.main_container}>
      <Siderbar guildData={guildData} />
      <div className={styles.page_content}>{children}</div>
    </div>
  );
};

export default Layout;
