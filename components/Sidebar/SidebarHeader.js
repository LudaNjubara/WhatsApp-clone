import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebaseConfig";

import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import styles from "../../styles/Sidebar/SidebarHeader.module.css";

function SidebarHeader({ user }) {
  const [threeDotOptionsVisible, setThreeDotsOptionsVisible] = useState(false);

  const signOut = () => {
    auth.signOut();
  };

  const toggleThreeDotOptionsVisibility = () => {
    setThreeDotsOptionsVisible((currentValue) => !currentValue);
  };

  return (
    <header className={styles.sidebarHeaderContainer}>
      <div className={styles.profileContainer}>
        <Image className={styles.profileImage} src={user?.photoURL} width={45} height={45} alt="profile" />
        <h5 className={styles.profileUsername}>{user?.displayName}</h5>
      </div>

      <div className={styles.optionsContainer}>
        <div type="button" className={styles.optionsButton}>
          <BsFillChatLeftTextFill className={styles.optionsIcon} />
        </div>
        <div type="button" className={styles.optionsButton} onClick={toggleThreeDotOptionsVisibility}>
          <BsThreeDotsVertical className={styles.optionsIcon} />
          <AnimatePresence>
            {threeDotOptionsVisible && (
              <motion.div
                key="threeDotOptionsContainer"
                className={styles.threeDotOptionsContainer}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                <ul className={styles.threeDotOptionsList}>
                  <li className={styles.threeDotOptionsItem}>
                    <button type="button" className={`${styles.optionItemButton}`}>
                      Preferences
                    </button>
                  </li>
                  <li className={styles.threeDotOptionsItem}>
                    <button
                      type="button"
                      className={`${styles.optionItemButton} ${styles.signOut}`}
                      onClick={signOut}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default SidebarHeader;
