import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import TimeAgo from "react-timeago";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { getRecipientEmail } from "../Utils/utils";

import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";

import { database } from "../firebaseConfig";

import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/Chat/ChatHeader.module.css";

function ChatHeader({ user, chat }) {
  const router = useRouter();
  const { recipientPhotoURL } = router.query;
  const [threeDotOptionsVisible, setThreeDotsOptionsVisible] = useState(false);

  const recipientEmail = getRecipientEmail(user, chat?.participants);
  const recipientFirestoreRef =
    recipientEmail && query(collection(database, "users"), where("email", "==", recipientEmail));
  const [recipientSnapshot, loading] = useCollection(recipientFirestoreRef);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const toggleThreeDotOptionsVisibility = () => {
    setThreeDotsOptionsVisible((currentValue) => !currentValue);
  };

  return (
    <header className={styles.chatHeaderContainer}>
      <div className={styles.personContainer}>
        <Image
          className={styles.profileImage}
          src={recipientPhotoURL ? recipientPhotoURL : "/images/default-profile-pic.webp"}
          width={45}
          height={45}
          alt="profile"
        />
        <div className={styles.personInfo}>
          <h5 className={styles.personUsername}>
            {loading ? (
              <SkeletonTheme
                highlightColor="#5a5a5a"
                baseColor="#3d3d3d"
                height={30}
                width={200}
                duration={0.6}
              >
                <Skeleton />
              </SkeletonTheme>
            ) : recipient?.displayName ? (
              recipient.displayName
            ) : (
              recipientEmail
            )}
          </h5>

          {recipientSnapshot ? (
            <p className={styles.personLastSeen}>
              Last seen:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo date={recipient?.lastSeen?.toDate()} minPeriod={30} />
              ) : (
                "Not available"
              )}
            </p>
          ) : (
            <SkeletonTheme highlightColor="#5a5a5a" baseColor="#3d3d3d" width={100} duration={0.6}>
              <Skeleton />
            </SkeletonTheme>
          )}
        </div>
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
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
