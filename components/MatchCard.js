import React,{useState} from "react";
 import styles from "../styles/MatchCard.module.css";


const MatchCard = ({ match, onSelect, selected }) => {
  const handleClick = () => {
    onSelect(match);
  };

  return (
    <div className={styles.matchCard} onClick={handleClick}>
      <img src={match.profilePic} alt="Profile" className={styles.profilePic} />
      <div className={styles.details}>
        <h3 className={styles.name}>{match.name}</h3>
      </div>
    </div>
  );
};

export default MatchCard;
