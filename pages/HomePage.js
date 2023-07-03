import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import UserCard from "../components/UserCard";
import Navbar from "../components/navbar";
import styles from "../styles/HomePage.module.css";
import MatchModal from "../components/MatchModal";
import MatchCard from "../components/MatchCard";


const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [matches, setMatches] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUsers, setMatchedUsers] = useState({ user1: null, user2: null });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchesCollection = collection(
          db,
          "profiles",
          loggedInUserId,
          "matches"
        );
        const matchesSnapshot = await getDocs(matchesCollection);
        const matchesData = matchesSnapshot.docs.map((doc) => doc.data());
        setMatches(matchesData);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [loggedInUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "profiles");
        const passesCollection = collection(
          db,
          "profiles",
          loggedInUserId,
          "passes"
        );
        const likesCollection = collection(
          db,
          "profiles",
          loggedInUserId,
          "likes"
        );

        const passedSnapshot = await getDocs(passesCollection);
        const passedUserIds = passedSnapshot.docs.map(
          (doc) => doc.data().userId
        );

        const likedSnapshot = await getDocs(likesCollection);
        const likedUserIds = likedSnapshot.docs.map((doc) => doc.data().userId);

        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (user) =>
              !passedUserIds.includes(user.id) &&
              !likedUserIds.includes(user.id) &&
              user.id !== loggedInUserId
          );

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [loggedInUserId]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setLoggedInUserId(user.uid);
    }
  }, []);

  const currentUser = users[currentUserIndex];

  // Pass function
  const handlePass = async () => {
    const passesCollection = collection(
      db,
      "profiles",
      loggedInUserId,
      "passes"
    );
    const passData = {
      userId: currentUser.id,
      ...currentUser,
      passedBy: loggedInUserId,
    };

    try {
      await setDoc(doc(passesCollection), passData);
      console.log("Pass stored successfully!");
    } catch (error) {
      console.error("Error storing pass:", error);
    }

    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  // Like function
  const handleLike = async () => {
    const likesCollection = collection(db, "profiles", loggedInUserId, "likes");
    const likeData = {
      userId: currentUser.id,
      ...currentUser,
      likedBy: loggedInUserId,
    };

    try {
      await setDoc(doc(likesCollection), likeData);
      console.log("Like stored successfully!");

      // Check for a match
      const likedByCollection = collection(
        db,
        "profiles",
        currentUser.id,
        "likes"
      );
      const likedBySnapshot = await getDocs(likedByCollection);
      const likedByData = likedBySnapshot.docs.map((doc) => doc.data());
      const matchedUser = likedByData.find(
        (like) => like.userId === loggedInUserId
      );

      if (matchedUser) {
        const matchesCollectionUser1 = collection(
          db,
          "profiles",
          loggedInUserId,
          "matches"
        );
        const matchDataUser1 = {
          userId: currentUser.id,
          ...currentUser,
          matchedBy: loggedInUserId,
        };
        await setDoc(doc(matchesCollectionUser1), matchDataUser1);
        console.log("Match stored for user 1 successfully!");

        const matchesCollectionUser2 = collection(
          db,
          "profiles",
          currentUser.id,
          "matches"
        );
        const matchDataUser2 = {
          userId: loggedInUserId,
          ...matchedUser,
          matchedBy: loggedInUserId,
        };
        await setDoc(doc(matchesCollectionUser2), matchDataUser2);
        console.log("Match stored for user 2 successfully!");

        // Update matches state
        setMatches((prevMatches) => [...prevMatches, matchDataUser1]);

        // Set matched users for the modal
        setMatchedUsers({ user1: currentUser, user2: matchedUser });

        // Show the match modal
        setShowMatchModal(true);
      }
    } catch (error) {
      console.error("Error storing Like:", error);
    }

    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  const closeModal = () => {
    setShowMatchModal(false);
  };

  return (
    <div>
      <Navbar />
      <div className={styles["user-cards"]}>
        {currentUser ? <UserCard user={currentUser} /> : <p>No more users</p>}
      </div>
      {currentUser && (
        <div className={styles["button-container"]}>
          <button onClick={handlePass}>Pass</button>
          <button onClick={handleLike}>Like</button>
        </div>
      )}
      <MatchModal
        isOpen={showMatchModal}
        onClose={closeModal}
        user1={matchedUsers.user1}
        user2={matchedUsers.user2}
      />
    </div>
  );
};

export default HomePage;
