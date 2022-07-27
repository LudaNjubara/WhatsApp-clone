import { useRef, useState } from "react";
import validator from "email-validator";
import { useCollection } from "react-firebase-hooks/firestore";
import { addDoc, collection, query, where } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { database } from "../firebaseConfig";
import ChatItem from "./ChatItem";

import { AiOutlineSend } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/Sidebar/SidebarBody.module.css";

function SidebarBody({ user }) {
  const createChatRef = useRef(null);
  const [createChatInputVisible, setCreateChatInputVisible] = useState(false);
  const chatsFirestoreRef = query(
    collection(database, "chats"),
    where("participants", "array-contains", user.email)
  );
  const [chatsSnapshot, loading] = useCollection(chatsFirestoreRef);

  const toggleCreateChatInputVisibility = () => {
    setCreateChatInputVisible((currentValue) => !currentValue);
    setTimeout(() => {
      createChatInputVisible ? createChatRef.current.blur() : createChatRef.current.focus();
    }, 50);
  };

  const chatAlreadyExists = (recipientEmail) => {
    const exists = !!chatsSnapshot?.docs.some((chat) => {
      const chatData = chat.data();
      return chatData.participants.includes(recipientEmail);
    });

    return exists;
  };

  const createChat = () => {
    const recipientEmail = createChatRef.current.value;

    if (chatAlreadyExists(recipientEmail)) {
      alert("Chat already exists");
      return;
    }

    if (validator.validate(recipientEmail) && recipientEmail !== user.email && recipientEmail !== "") {
      addDoc(collection(database, "chats"), {
        participants: [user.email, recipientEmail],
      }).catch((error) => {
        console.error(error);
      });
    } else {
      alert("Invalid email address");
    }
  };

  return (
    <div className={styles.sidebarBodyContainer}>
      <div className={styles.createChatContainer}>
        <button type="button" className={styles.createChatButton} onClick={toggleCreateChatInputVisibility}>
          Start chatting
        </button>

        <AnimatePresence>
          {createChatInputVisible && (
            <motion.div
              className={styles.createChatInfo}
              key="createChatInfo"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "ease-out" }}
            >
              <input
                ref={createChatRef}
                type="email"
                placeholder="Enter person's email..."
                className={styles.createChatInput}
              />
              <button
                type="button"
                className={`${styles.createChatButton} ${styles.isCloseButton}`}
                onClick={toggleCreateChatInputVisibility}
              >
                <IoMdClose className={styles.createChatIcon} />
              </button>
              <button type="button" className={styles.createChatButton} onClick={createChat}>
                <AiOutlineSend className={styles.createChatIcon} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.chatsContainer}>
        <h5 className={styles.chatsContainerTitle}>Conversations</h5>
        <ul className={styles.chatsList}>
          {loading ? (
            <SkeletonTheme highlightColor="#5a5a5a" baseColor="#3d3d3d" height={60} duration={0.6}>
              <Skeleton count={8} className={styles.skeletonLoadingItem} />
            </SkeletonTheme>
          ) : (
            chatsSnapshot?.docs.map((chat) => {
              return (
                <ChatItem
                  key={chat.id}
                  chatId={chat.id}
                  user={user}
                  participants={chat.data().participants}
                  styles={styles}
                />
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default SidebarBody;
