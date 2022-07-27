import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../firebaseConfig";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";

import styles from "../../styles/Chat/Chat.module.css";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <>
      <div id={styles.chatHeaderWrapper}>
        <ChatHeader user={user} chat={chat} />
      </div>
      <div id={styles.chatBodyWrapper}>
        <ChatBody user={user} chat={chat} messages={messages} />
      </div>
    </>
  );
}

export default Chat;
