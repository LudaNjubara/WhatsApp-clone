import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { database } from "../firebaseConfig";
import { getRecipientEmail, truncate } from "../Utils/utils";

function ChatItem({ chatId, user, isGroupChat, participants, showChat, styles }) {
  const router = useRouter();
  const [recipientsDataArray, setRecipientsDataArray] = useState([]);

  const recipientEmails = getRecipientEmail(user, participants);
  const recipientsFirestoreRef = query(collection(database, "users"), where("email", "in", recipientEmails));
  const [recipientsSnapshot, loading] = useCollection(recipientsFirestoreRef);

  // last message
  const lastMessageQuery = query(
    collection(database, `chats/${chatId}/messages`),
    orderBy("timestamp", "desc"),
    limit(1)
  );
  const [lastMessageSnapshot] = useCollection(lastMessageQuery);
  const lastMessage = lastMessageSnapshot?.docs?.[0]?.data().messageText;

  const showLastMessage = () => {
    return truncate(lastMessage);
  };

  const handleRouteChangeComplete = () => {
    if (showChat) {
      showChat();
    }
  };

  const openChat = () => {
    //if user is already on the chat page, then just return
    if (router.asPath.includes(chatId)) {
      return;
    }

    router.push({
      pathname: `/chat/${chatId}`,
      query: { recipientPhotoURL: recipientsDataArray[0]?.photoURL },
    });

    router.events.on("routeChangeComplete", handleRouteChangeComplete);
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
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [recipientsSnapshot]);

  return (
    recipientsDataArray && (
      <li className={styles.chatsListItem} onClick={openChat} key={chatId}>
        <Image
          className={styles.chatsListItemImage}
          src={
            isGroupChat
              ? "/images/default-group-pic.webp"
              : !!recipientsDataArray[0]?.photoURL
              ? recipientsDataArray[0].photoURL
              : "/images/default-profile-pic.webp"
          }
          alt="person profile"
          width={45}
          height={45}
        />

        <div className={styles.chatsListItemInfo}>
          <h5 className={styles.chatsListItemInfoUsername}>
            {isGroupChat
              ? truncate(recipientsDataArray.map((recipient) => recipient.displayName).join(", "), 25)
              : !!recipientsDataArray[0]?.displayName
              ? recipientsDataArray[0].displayName
              : recipientsDataArray[0]?.email}
          </h5>
          <p className={styles.chatsListItemInfoMessage}>{showLastMessage()}</p>
        </div>
      </li>
    )
  );
}

export default ChatItem;
