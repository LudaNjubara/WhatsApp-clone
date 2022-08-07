import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { setDoc, doc, collection, orderBy, query, serverTimestamp, addDoc } from "firebase/firestore";

import { database } from "../firebaseConfig";
import Message from "./Message";
import { generateRecipientColor } from "../Utils/utils";

import { AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/Chat/ChatBody.module.css";

function ChatBody({ user, messages, participants, isGroupChat }) {
  const router = useRouter();
  const { id } = router.query;

  let recipientsWithColorsArray = [];

  if (localStorage.getItem(`recipientColors - ${id}`)) {
    recipientsWithColorsArray = JSON.parse(localStorage.getItem(`recipientColors - ${id}`));
  } else {
    // create object with participants colors and save it to local storage
    participants.forEach((recipientEmail) => {
      if (recipientEmail === user.email) return;

      const color = generateRecipientColor();
      recipientsWithColorsArray.push({ recipientEmail, color });
    });

    localStorage.setItem(`recipientColors - ${id}`, JSON.stringify(recipientsWithColorsArray));

    // get the newly created object with participants colors from local storage
    recipientsWithColorsArray = JSON.parse(localStorage.getItem(`recipientColors - ${id}`));
  }

  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);
  const sendMessageInputRef = useRef(null);
  const scrollToLastMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    query(collection(database, `chats/${id}/messages`), orderBy("timestamp", "asc"))
  );

  const scrollToBottom = () => {
    scrollToLastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const checkIfEmpty = () => {
    if (sendMessageInputRef.current.value.trim()) {
      setIsSendButtonDisabled(false);
      return false;
    }

    setIsSendButtonDisabled(true);
    return true;
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const isEmpty = checkIfEmpty();
    if (isEmpty) return;

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
      sender: [user.email, user.displayName],
      messageText: messageText,
      photoURL: user.photoURL,
    }).then(() => {
      sendMessageInputRef.current.focus();
      sendMessageInputRef.current.value = "";
      setIsSendButtonDisabled(true);
      scrollToBottom();
    });
  };

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => {
        return (
          <Message
            key={message.id}
            isGroupChat={isGroupChat}
            user={user}
            sender={message.data().sender[1] ?? message.data().sender[0]}
            senderColor={
              recipientsWithColorsArray.find(
                (recipient) => recipient.recipientEmail === message.data().sender[0]
              )?.color
            }
            message={{ ...message.data(), timestamp: message.data().timestamp?.toDate().getTime() }}
            styles={styles}
          />
        );
      });
    } else if (messages) {
      return JSON.parse(messages).map((message) => {
        <Message
          key={message.id}
          user={user}
          sender={message.sender[1] ?? message.sender[0]}
          senderColor={
            recipientsWithColorsArray.find((recipient) => recipient.recipientEmail === message.sender[0])
              ?.color
          }
          isGroupChat={isGroupChat}
          message={message}
          styles={styles}
        />;
      });
    }
  };

  useEffect(() => {
    scrollToBottom();

    localStorage.clear();

    //check if participants already have their colors assigned to them
    // if so, just get the object containing the info, otherwise generate a new color for each
    //participant and save it to local storage as a new object
  }, []);

  return (
    <>
      <div className={styles.chatBodyContainer}>
        <div className={styles.chatBody}>
          {showMessages()}
          <div ref={scrollToLastMessageRef}></div>
        </div>
      </div>
      <form onSubmit={sendMessage} className={styles.chatInputContainer}>
        <input
          type="text"
          ref={sendMessageInputRef}
          className={styles.sendMessageInput}
          placeholder="Type a message..."
          onChange={checkIfEmpty}
        />
        <button type="submit" className={styles.sendMessageButton} disabled={isSendButtonDisabled}>
          <AiOutlineSend className={styles.sendMessageChatIcon} />
        </button>
      </form>
    </>
  );
}

export default ChatBody;
