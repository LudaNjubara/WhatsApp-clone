import Sidebar from "../Sidebar/Sidebar";
import EmptyChat from "../Chat/EmptyChat";

import styles from "../../styles/MainWindow/MainWindow.module.css";

function MainWindow() {
  return (
    <div id={styles.mainWindowWrapper}>
      <section id={styles.sidebarWrapper}>
        <Sidebar />
      </section>
      <section id={styles.chatWrapper}>
        <EmptyChat />
      </section>
    </div>
  );
}

export default MainWindow;
