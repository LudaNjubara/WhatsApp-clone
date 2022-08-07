import { motion } from "framer-motion";
import dayjs from "dayjs";
import Linkify from "react-linkify";

function Message({ user, sender, message, senderColor, isGroupChat, styles }) {
  console.log(senderColor);
  return (
    <motion.div
      className={`${styles.chatBodyMessageContainer} ${
        (sender === user.displayName || sender === user.email) && styles.isUserMessage
      }`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {isGroupChat && (
        <span className={styles.messageAuthor} style={{ color: senderColor }}>
          {sender}
        </span>
      )}
      <p className={styles.chatBodyMessage}>
        <Linkify
          componentDecorator={(href, text, key) => (
            <a href={href} key={key} target="_blank" rel="noopener noreferrer">
              {text}
            </a>
          )}
        >
          {message?.messageText}
        </Linkify>
      </p>
      <span className={styles.messageTimestamp}>
        {dayjs(message?.timestamp).format("hh:mm A").toString()}
      </span>
    </motion.div>
  );
}

export default Message;
