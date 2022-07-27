import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";

import { auth, database } from "../../components/firebaseConfig";
import { getRecipientEmail } from "../../components/Utils/utils";

import Chat from "../../components/Chat/Chat";
import Sidebar from "../../components/Sidebar/Sidebar";

import styles from "../../styles/MainWindow/MainWindow.module.css";

function ChatRoom({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <>
      <Head>
        <title>Chat with {getRecipientEmail(user, chat?.participants)}</title>
      </Head>

      <div id={styles.mainWindowWrapper}>
        <section id={styles.sidebarWrapper}>
          <Sidebar />
        </section>
        <section id={styles.chatWrapper}>
          <Chat chat={chat} messages={messages} />
        </section>
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
      chat: chat,
    },
  };
}
