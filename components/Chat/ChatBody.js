import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { setDoc, doc, collection, orderBy, query, serverTimestamp, addDoc } from "firebase/firestore";

import { database } from "../firebaseConfig";
import Message from "./Message";

import { AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/Chat/ChatBody.module.css";

function ChatBody({ user, messages }) {
  const router = useRouter();
  const { id } = router.query;
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
  const sendMessageInputRef = useRef(null);
  const scrollToLastMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    query(collection(database, `chats/${id}/messages`), orderBy("timestamp", "asc"))
  );

  const scrollToBottom = () => {
    scrollToLastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = sendMessageInputRef.current.value;

    setDoc(
      doc(database, `users/${user.uid}`),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    addDoc(collection(database, `chats/${id}/messages`), {
      timestamp: serverTimestamp(),
      sender: user.email,
      messageText: messageText,
      photoURL: user.photoURL,
    }).then(() => {
      sendMessageInputRef.current.value = "";
      setIsSendButtonDisabled(true);
      scrollToBottom();
    });
  };

  const checkIfEmpty = () => {
    sendMessageInputRef.current.value ? setIsSendButtonDisabled(false) : setIsSendButtonDisabled(true);
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => {
        return (
          <Message
            key={message.id}
            user={user}
            sender={message.data().sender}
            message={{ ...message.data(), timestamp: message.data().timestamp?.toDate().getTime() }}
            styles={styles}
          />
        );
      });
    } else {
      if (messages) {
        return JSON.parse(messages).map((message) => {
          <Message key={message.id} user={user} sender={message.sender} message={message} styles={styles} />;
        });
      }
    }
  };

  return (
    <>
      <div className={styles.chatBodyContainer}>
        <div className={styles.chatBody}>
          {showMessages()}
          <div ref={scrollToLastMessageRef}></div>
        </div>
      </div>
      <div className={styles.chatInputContainer}>
        <input
          type="text"
          ref={sendMessageInputRef}
          className={styles.sendMessageInput}
          placeholder="Type a message..."
          onChange={checkIfEmpty}
        />
        <button
          type="button"
          className={styles.sendMessageButton}
          disabled={isSendButtonDisabled}
          onClick={sendMessage}
        >
          <AiOutlineSend className={styles.sendMessageChatIcon} />
        </button>
      </div>
    </>
  );
}

export default ChatBody;
