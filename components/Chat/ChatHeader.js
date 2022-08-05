import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import TimeAgo from "react-timeago";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { getCSSVariableValue, getRecipientEmail, truncate } from "../Utils/utils";

import { database } from "../firebaseConfig";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/Chat/ChatHeader.module.css";

function ChatHeader({ user, chat, isGroupChat, hideChat }) {
  const router = useRouter();
  const [recipientsDataArray, setRecipientsDataArray] = useState([]);
  const [threeDotOptionsVisible, setThreeDotsOptionsVisible] = useState(false);

  const recipientEmails = getRecipientEmail(user, chat.participants);
  const recipientsFirestoreRef = query(collection(database, "users"), where("email", "in", recipientEmails));
  const [recipientsSnapshot, loading] = useCollection(recipientsFirestoreRef);

  const toggleThreeDotOptionsVisibility = () => {
    setThreeDotsOptionsVisible((currentValue) => !currentValue);
  };

  const showLastSeen = () => {
    if (isGroupChat) return;

    const recipient = recipientsSnapshot?.docs?.[0]?.data();

    return loading ? (
      <SkeletonTheme
        highlightColor={getCSSVariableValue("--secondary-background-accent")}
        baseColor={getCSSVariableValue("--primary-background-accent")}
        width={100}
        duration={0.6}
      >
        <Skeleton />
      </SkeletonTheme>
    ) : (
      <p className={styles.personLastSeen}>
        Last seen:{" "}
        {!!recipient?.lastSeen.toDate() ? (
          <TimeAgo date={recipient?.lastSeen.toDate()} minPeriod={30} />
        ) : (
          "Not available"
        )}
      </p>
    );
  };

  useEffect(() => {
    if (recipientsSnapshot?.docs?.length) {
      setRecipientsDataArray(
        recipientsSnapshot.docs.map((doc) => {
          return {
            email: doc.data().email,
            displayName: doc.data().displayName,
            photoURL: doc.data().photoURL,
          };
        })
      );
    }

    return () => {
      setRecipientsDataArray([]);
    };
  }, [recipientsSnapshot]);

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
              src={
                isGroupChat
                  ? "/images/default-group-pic.webp"
                  : !!recipientsDataArray[0]?.photoURL
                  ? recipientsDataArray[0].photoURL
                  : "/images/default-profile-pic.webp"
              }
              alt="profile"
              layout="fill"
            />
          </div>
          <div className={styles.personInfo}>
            <h5 className={styles.personUsername}>
              {loading ? (
                <SkeletonTheme
                  highlightColor={getCSSVariableValue("--secondary-background-accent")}
                  baseColor={getCSSVariableValue("--primary-background-accent")}
                  height={30}
                  width={200}
                  duration={0.6}
                >
                  <Skeleton />
                </SkeletonTheme>
              ) : (
                truncate(
                  recipientsDataArray
                    .map((recipient) => {
                      return !!recipient.displayName ? recipient.displayName : recipient.email;
                    })
                    .join(", "),
                  40
                )
              )}
            </h5>

            {showLastSeen()}
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
