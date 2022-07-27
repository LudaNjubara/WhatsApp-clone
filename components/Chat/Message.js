import { motion } from "framer-motion";
import dayjs from "dayjs";

function Message({ user, sender, message, styles }) {
  return (
    <motion.div
      className={`${styles.chatBodyMessageContainer} ${sender === user.email && styles.isUserMessage}`}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <p className={styles.chatBodyMessage}>{message?.messageText}</p>
      <span className={styles.messageTimestamp}>
        {dayjs(message?.timestamp).format("hh:mm A").toString()}
      </span>
    </motion.div>
  );
}

export default Message;
