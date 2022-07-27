import Image from "next/image";
import { useRouter } from "next/router";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { database } from "../firebaseConfig";
import { getRecipientEmail } from "../Utils/utils";

function ChatItem({ chatId, user, participants, styles }) {
  const recipientEmail = getRecipientEmail(user, participants);
  const recipientFirestoreRef = query(collection(database, "users"), where("email", "==", recipientEmail));
  const [recipientSnapshot, loading] = useCollection(recipientFirestoreRef);
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const router = useRouter();

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
        <p className={styles.chatsListItemInfoMessage}>Some message over here...</p>
      </div>
    </li>
  );
}

export default ChatItem;
