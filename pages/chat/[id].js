import { useState } from "react";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

import { auth, database } from "../../components/firebaseConfig";
import { getRecipientEmail } from "../../components/Utils/utils";

import Chat from "../../components/Chat/Chat";
import Sidebar from "../../components/Sidebar/Sidebar";

import styles from "../../styles/MainWindow/MainWindow.module.css";

function ChatRoom({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [isMobile, setIsMobile] = useState(!!(window.innerWidth < 768));
  const [isChatVisible, setIsChatVisible] = useState(true);
  const parsedChat = chat && JSON.parse(chat);
  let chatVariants;

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      if (isMobile) {
        setIsMobile(false);
        setIsChatVisible(true);
      }
    } else {
      if (!isMobile) {
        setIsMobile(true);
      }
    }
  });

  if (isMobile) {
    chatVariants = {
      hidden: { x: "100vw" },
      visible: {
        x: 0,
        transition: {
          duration: 0.3,
        },
      },
      exit: { x: "100vw", transition: { duration: 0.3 } },
    };
  }

  const hideChat = () => {
    setIsChatVisible(false);
  };

  const showChat = () => {
    console.log("showChat", window.location.pathname);
    setIsChatVisible(true);
  };

  return (
    <>
      <Head>
        <title>Chat with {getRecipientEmail(user, parsedChat?.participants)}</title>
      </Head>

      <div id={styles.mainWindowWrapper}>
        <section id={styles.sidebarWrapper}>
          <Sidebar showChat={showChat} />
        </section>

        <AnimatePresence>
          {isChatVisible && (
            <motion.section
              id={styles.chatWrapper}
              variants={chatVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Chat chat={parsedChat} messages={messages} hideChat={hideChat} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default ChatRoom;

export async function getServerSideProps(context) {
  const chatRoomFirestoreRef = doc(database, `chats/${context.query.id}`);

  const messagesRes = await getDocs(
    query(collection(chatRoomFirestoreRef, "messages"), orderBy("timestamp", "asc"))
  );

  const messages = messagesRes.docs
    .map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    })
    .map((messages) => {
      return {
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
      };
    });

  const chatRes = await getDoc(chatRoomFirestoreRef);
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: JSON.stringify(chat),
    },
  };
}
