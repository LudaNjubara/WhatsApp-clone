import SidebarHeader from "./SidebarHeader";
import SidebarBody from "./SidebarBody";

import styles from "../../styles/Sidebar/Sidebar.module.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

function Sidebar() {
  const [user] = useAuthState(auth);

  return (
    <>
      <div id={styles.sidebarHeaderWrapper}>
        <SidebarHeader user={user} />
      </div>
      <div id={styles.sidebarBodyWrapper}>
        <SidebarBody user={user} />
      </div>
    </>
  );
}

export default Sidebar;
