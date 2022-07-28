import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../firebaseConfig";

import SidebarHeader from "./SidebarHeader";
import SidebarBody from "./SidebarBody";

import styles from "../../styles/Sidebar/Sidebar.module.css";

function Sidebar({ showChat }) {
  const [user] = useAuthState(auth);

  return (
    <>
      <div id={styles.sidebarHeaderWrapper}>
        <SidebarHeader user={user} />
      </div>
      <div id={styles.sidebarBodyWrapper}>
        <SidebarBody user={user} showChat={showChat} />
      </div>
    </>
  );
}

export default Sidebar;
