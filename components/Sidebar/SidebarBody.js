import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { database } from "../firebaseConfig";
import { getCSSVariableValue } from "../Utils/utils";
import CreateChat from "./CreateChat";
import ChatItem from "./ChatItem";

import "react-loading-skeleton/dist/skeleton.css";
import styles from "../../styles/Sidebar/SidebarBody.module.css";

function SidebarBody({ user, showChat }) {
  const chatsFirestoreRef = query(
    collection(database, "chats"),
    where("participants", "array-contains", user.email)
  );
  const [chatsSnapshot, loading] = useCollection(chatsFirestoreRef);

  return (
    <div className={styles.sidebarBodyContainer}>
      {chatsSnapshot && <CreateChat user={user} chatsSnapshot={chatsSnapshot} />}

      <div className={styles.chatsContainer}>
        <h5 className={styles.chatsContainerTitle}>Conversations</h5>
        <ul className={styles.chatsList}>
          {loading ? (
            <SkeletonTheme
              highlightColor={getCSSVariableValue("--secondary-background-accent")}
              baseColor={getCSSVariableValue("--primary-background-accent")}
              height={60}
              duration={0.6}
            >
              <Skeleton count={8} className={styles.skeletonLoadingItem} />
            </SkeletonTheme>
          ) : (
            chatsSnapshot?.docs.map((chat) => {
              return (
                <ChatItem
                  key={chat.id}
                  chatId={chat.id}
                  user={user}
                  isGroupChat={chat.data().isGroup}
                  participants={chat.data().participants}
                  styles={styles}
                  showChat={showChat}
                />
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export default SidebarBody;
