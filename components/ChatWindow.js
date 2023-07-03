import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot, addDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import styles from "../styles/ChatWindow.module.css";

const ChatWindow = ({ match }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const matchId = match.userId; // Use the match ID to identify the chat

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(
      messagesRef,
      orderBy("timestamp", "asc"),
      limit(50),
      where("senderId", "in", [auth.currentUser.uid, match.userId]),
      where("receiverId", "in", [auth.currentUser.uid, match.userId])
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => doc.data());
      setMessages(messagesData);
    });

    return () => {
      unsubscribe();
    };
  }, [matchId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    try {
      await addDoc(collection(db, "messages"), {
        message: newMessage,
        senderId: auth.currentUser.uid,
        receiverId: match.userId,
        timestamp: new Date(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={styles["chat-window"]}>
      <div className={styles["chat-header"]}>
        <h3 className={styles["chat-title"]}>Chat with {match.name}</h3>
      </div>
      <div className={styles["chat-messages"]}>
        {messages.map((message) => (
          <div
            key={message.timestamp}
            className={
              message.senderId === auth.currentUser.uid
                ? styles["chat-message-sent"]
                : styles["chat-message-received"]
            }
          >
            <p className={styles["message-content"]}>{message.message}</p>
            <small className={styles["message-sender"]}>
              {message.senderId === auth.currentUser.uid ? "You" : match.name}
            </small>
            <small className={styles["message-timestamp"]}>
              {message.timestamp.toDate().toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className={styles["message-form"]}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles["message-input"]}
        />
        <button type="submit" className={styles["send-button"]}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
