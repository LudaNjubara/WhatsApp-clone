import Image from "next/image";
import { useRouter } from "next/router";
import { collection, limit, orderBy, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { database } from "../firebaseConfig";
import { getRecipientEmail, truncate } from "../Utils/utils";

function ChatItem({ chatId, user, participants, styles }) {
  const router = useRouter();

  const recipientEmail = getRecipientEmail(user, participants);
  const recipientFirestoreRef = query(collection(database, "users"), where("email", "==", recipientEmail));
  const [recipientSnapshot, loading] = useCollection(recipientFirestoreRef);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  // last message
  const showLastMessage = () => {
    const lastMessageQuery = query(
      collection(database, `chats/${chatId}/messages`),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const [lastMessageSnapshot, loading] = useCollection(lastMessageQuery);
    const lastMessage = lastMessageSnapshot?.docs?.[0]?.data().messageText;
    return truncate(lastMessage);
  };

  const openChat = () => {
    router.push({
      pathname: `/chat/${chatId}`,
      query: { recipientPhotoURL: recipient?.photoURL },
    });
  };

  return (
    <li className={styles.chatsListItem} onClick={openChat}>
      <Image
        className={styles.chatsListItemImage}
        src={recipient?.photoURL ? recipient.photoURL : "/images/default-profile-pic.webp"}
        alt="person profile"
        width={45}
        height={45}
      />

      <div className={styles.chatsListItemInfo}>
        <h5 className={styles.chatsListItemInfoUsername}>
          {recipient?.displayName ? recipient.displayName : recipientEmail}
        </h5>
        <p className={styles.chatsListItemInfoMessage}>{showLastMessage()}</p>
      </div>
    </li>
  );
}

export default ChatItem;
