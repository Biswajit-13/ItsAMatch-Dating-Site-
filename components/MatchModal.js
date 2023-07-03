import React from "react";
import styles from "../styles/MatchModal.module.css";
import { useRouter } from "next/router";

const MatchModal = ({ isOpen, onClose, user1, user2 }) => {
  if (!isOpen) {
    return null;
  }

  const router = useRouter();
const redirecttoChat = ()=>{
router.push("./Matches");
}
  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-header"]}>
          <h3>It's a Match!</h3>
          <button className={styles["close-button"]} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles["modal-body"]}>
          <div className={styles["user-container"]}>
            <div className={styles["user-card"]}>
              <img src={user1.profilePic} alt="User 1" />
              <h4>{user1.name}</h4>
            </div>
            <div className={styles["heart-emoji"]}>❤️</div>
            <div className={styles["user-card"]}>
              <img src={user2.profilePic} alt="User 2" />
              <h4>{user2.name}</h4>
            </div>
          </div>
          <p>You've both liked each other!</p>
        </div>
        <div className={styles["modal-footer"]}>
          <button className={styles["message-button"]} onClick={redirecttoChat}>Message</button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
