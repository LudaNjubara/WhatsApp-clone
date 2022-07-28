import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import TimeAgo from "react-timeago";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { getRecipientEmail } from "../Utils/utils";

import { database } from "../firebaseConfig";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/Chat/ChatHeader.module.css";

function ChatHeader({ user, chat, hideChat }) {
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
      <div className={styles.chatHeaderLeft}>
        <button className={styles.backButton} onClick={hideChat}>
          <FaArrowLeft className={styles.optionsIcon} />
        </button>

        <div className={styles.personContainer}>
          <div className={styles.personImageContainer}>
            <Image
              className={styles.profileImage}
              src={recipientPhotoURL ? recipientPhotoURL : "/images/default-profile-pic.webp"}
              alt="profile"
              layout="fill"
            />
          </div>
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
      </div>

      <div className={styles.optionsContainer}>
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
