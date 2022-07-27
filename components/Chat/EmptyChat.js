import Image from "next/image";

import styles from "../../styles/Chat/EmptyChat.module.css";

function EmptyChat() {
  return (
    <div className={styles.emptyChatContainer}>
      <div className={styles.emptyChatImageContainer}>
        <Image src={"/images/start-convo.svg"} alt="Start a conversation" layout="fill" />
      </div>
      <h3 className={styles.emptyChatText}>Open conversation to view messages</h3>
    </div>
  );
}

export default EmptyChat;
