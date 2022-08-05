import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import validator from "email-validator";
import { addDoc, collection } from "firebase/firestore";

import { database } from "../firebaseConfig";

import { AiOutlineSend } from "react-icons/ai";
import { BsPlusLg } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { MdPersonAddAlt1, MdGroupAdd } from "react-icons/md";
import styles from "../../styles/Sidebar/CreateChat.module.css";

function CreateChat({ user, chatsSnapshot }) {
  const create1on1ChatInputRef = useRef(null);
  const createGroupChatInputRef = useRef(null);
  const [createChatSubitemButtonsVisible, setCreateChatSubitemButtonsVisible] = useState(false);
  const [createChatModalVisible, setCreateChatModalVisible] = useState(false);
  const [shouldOpen1on1Modal, setShouldOpen1on1Modal] = useState(false);
  const [shouldOpenGroupModal, setShouldOpenGroupModal] = useState(false);
  const [groupList, setGroupList] = useState([]);

  const variants = {
    subitemsContainerVariant: {
      hidden: { x: "-10%", y: 0 },
      show: {
        y: -60,
        transition: {
          staggerChildren: 0.1,
          staggerDirection: -1,
        },
      },
      exit: {
        y: -60,
        transition: {
          staggerChildren: 0.1,
          staggerDirection: -1,
        },
      },
    },

    subitemVariant: {
      hidden: { y: 15, scale: 0.5 },
      show: { y: 0, scale: 1 },
      exit: { opacity: 0, y: 0, scale: 0 },
    },
  };

  const chatAlreadyExists = (recipientArray) => {
    const allParticipantsArray = [user.email, ...recipientArray];

    const exists = chatsSnapshot?.docs.some((chat) => {
      const chatData = chat.data();

      if (chatData.participants.length === allParticipantsArray.length) {
        const chatParticipantsArray = chatData.participants;

        return !!allParticipantsArray.every((participant) => chatParticipantsArray.includes(participant));
      }
    });

    return exists;
  };

  const toggleSubitemButtonsVisibility = () => {
    const openSubitemsButtonIcon = document.querySelector(`#${styles.openSubitemsButtonIcon}`);
    openSubitemsButtonIcon && openSubitemsButtonIcon.classList.toggle(styles.active);

    setCreateChatSubitemButtonsVisible(!createChatSubitemButtonsVisible);
  };

  const toggleCreateChatModalVisibility = (isGroup) => {
    setCreateChatModalVisible(!createChatModalVisible);

    isGroup ? setShouldOpenGroupModal(!shouldOpenGroupModal) : setShouldOpen1on1Modal(!shouldOpen1on1Modal);

    setTimeout(() => {
      if (isGroup) {
      } else {
        create1on1ChatInputRef.current.focus();
      }
    }, 50);
  };

  const addPersonToGroupList = (personEmail) => {
    const validEmail = validator.validate(personEmail);

    if (!validEmail) {
      alert("Invalid email address");
      return;
    } else if (!!groupList.filter((email) => email === personEmail).length) {
      alert("You've already added this person to the group!");
      return;
    }

    setGroupList([...groupList, personEmail]);

    createGroupChatInputRef.current.value = "";
  };

  const removePersonFromGroupList = (personEmail) => {
    setGroupList(groupList.filter((email) => email !== personEmail));
  };

  const createChat = (recipientArray, isGroup) => {
    if (chatAlreadyExists(recipientArray)) {
      alert("Chat already exists");
      return;
    }

    const emailsValid = !!recipientArray.every((email) => validator.validate(email));

    const isUserEmail = !!recipientArray.some((email) => email === user.email);

    if (emailsValid && !isUserEmail && recipientArray.length) {
      addDoc(collection(database, "chats"), {
        participants: [user.email, ...recipientArray],
        isGroup: isGroup,
      })
        .then(() => {
          setCreateChatModalVisible(false);
          setShouldOpen1on1Modal(false);
          setShouldOpenGroupModal(false);
          setGroupList([]);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert("Invalid email address");
    }
  };

  return (
    <div className={styles.createChatContainer}>
      <div
        className={`${styles.createChatButton} ${styles.openSubitemsButton}`}
        onClick={toggleSubitemButtonsVisibility}
      >
        <BsPlusLg id={styles.openSubitemsButtonIcon} />
      </div>

      <AnimatePresence>
        {createChatSubitemButtonsVisible && (
          <motion.div
            variants={variants.subitemsContainerVariant}
            initial="hidden"
            animate="show"
            exit="exit"
            className={styles.subitemsContainer}
          >
            <motion.div
              variants={variants.subitemVariant}
              className={`${styles.createChatButton} ${styles.subitemButton}`}
              onClick={() => toggleCreateChatModalVisibility(true)}
            >
              <MdGroupAdd className={styles.subitemButtonIcon} />
            </motion.div>
            <motion.div
              variants={variants.subitemVariant}
              className={`${styles.createChatButton} ${styles.subitemButton}`}
              onClick={() => toggleCreateChatModalVisibility(false)}
            >
              <MdPersonAddAlt1 className={styles.subitemButtonIcon} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {createChatModalVisible && (
          <motion.div
            className={styles.createChatModal}
            key="createChatInfo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "ease-out" }}
          >
            {shouldOpen1on1Modal && (
              <div className={styles.createChatModalInner}>
                <input
                  ref={create1on1ChatInputRef}
                  type="email"
                  placeholder="Enter person's email..."
                  className={styles.createChatInput}
                />

                <div className={styles.modalButtonsContainer}>
                  <button
                    type="button"
                    className={`${styles.modalButton} ${styles.isCloseButton}`}
                    onClick={() => toggleCreateChatModalVisibility(false)}
                  >
                    <IoMdClose className={styles.createChatIcon} />
                    <span className={styles.createChatButtonText}>Cancel</span>
                  </button>
                  <button
                    type="button"
                    className={styles.modalButton}
                    onClick={() => createChat([create1on1ChatInputRef.current.value], false)}
                  >
                    <AiOutlineSend className={styles.createChatIcon} />
                    <span className={styles.createChatButtonText}>Add friend</span>
                  </button>
                </div>
              </div>
            )}

            {shouldOpenGroupModal && (
              <div className={styles.createChatModalInner}>
                <div className={styles.createChatInputContainer}>
                  <input
                    ref={createGroupChatInputRef}
                    type="email"
                    placeholder="Enter person's email..."
                    className={styles.createChatInput}
                  />
                  <button
                    type="button"
                    className={`${styles.createChatButton} ${styles.addPersonButton}`}
                    onClick={() => addPersonToGroupList(createGroupChatInputRef.current.value)}
                  >
                    <BsPlusLg className={styles.createChatIcon} />
                  </button>
                </div>

                <div className={styles.modalGroupListWrapper}>
                  <h5 className={styles.modalGroupListTitle}>Added people</h5>
                  <ul className={styles.modalGroupListContainer}>
                    {groupList.map((email) => (
                      <li className={styles.modalGroupListItem} key={email}>
                        <span>{email}</span>
                        <button
                          type="button"
                          className={`${styles.removePersonButton}`}
                          onClick={() => removePersonFromGroupList(email)}
                        >
                          <IoMdClose className={styles.removePersonIcon} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.modalButtonsContainer}>
                  <button
                    type="button"
                    className={`${styles.modalButton} ${styles.isCloseButton}`}
                    onClick={() => toggleCreateChatModalVisibility(true)}
                  >
                    <IoMdClose className={styles.createChatIcon} />
                    <span className={styles.createChatButtonText}>Cancel</span>
                  </button>
                  <button
                    type="button"
                    disabled={groupList.length < 2}
                    className={styles.modalButton}
                    onClick={() => createChat(groupList, true)}
                  >
                    <AiOutlineSend className={styles.createChatIcon} />
                    <span className={styles.createChatButtonText}>Create Group</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateChat;
