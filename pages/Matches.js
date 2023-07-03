import React, { useState, useEffect } from 'react';
import MatchCard from '../components/MatchCard';
import ChatWindow from '../components/ChatWindow';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import styles from '../styles/Matches.module.css';

const Matches = () => {
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchMatches = async () => {
    try {
      const matchesCollection = collection(
        db,
        'profiles',
        loggedInUserId,
        'matches'
      );
      const matchesSnapshot = await getDocs(matchesCollection);
      const matchesData = matchesSnapshot.docs.map((doc) => doc.data());
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setLoggedInUserId(user.uid);
    }
  }, []);

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
  };

  useEffect(() => {
    fetchMatches();
  }, [loggedInUserId]);

  return (
    <div className={styles['matches-container']}>
      <div className={styles['matches-layout']}>
        <div className={styles['match-list']}>
          {matches.map((match) => (
            <MatchCard
              key={match.userId}
              match={match}
              onSelect={handleMatchSelect}
              selected={selectedMatch && selectedMatch.userId === match.userId}
            />
          ))}
        </div>
        <div className={styles['chat-window-container']}>
          <div className={styles['chat-window']}>
            {selectedMatch ? (
              <ChatWindow loggedInUserId={loggedInUserId} match={selectedMatch} />
            ) : (
              <p className={styles['chat-window-placeholder']}>Select a match to start chatting</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Matches;
