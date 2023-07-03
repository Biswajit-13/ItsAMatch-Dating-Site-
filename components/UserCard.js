import React from 'react';
import styles from '../styles/UserCard.module.css';

const UserCard = ({ user }) => {
  const {name, age, bio, profilePic, gallery } = user;

  return (
        <div className={styles['user-card']}>
        <div className={styles['top-section']}>
        <div className={styles['profile-pic-container']}>
          <img className={styles['profile-pic']} src={profilePic} alt="Profile Picture" />
        </div>
        <div className={styles['user-info']}>
          <h3 className={styles['user-name']}>{name}</h3>
          <p className={styles['user-age']}>{age}</p>
          <p className={styles['user-bio']}>{bio}</p>
        </div>
      </div>
      <div className={styles['carousel-section']}>
        <div className={styles['image-carousel']}>
          {gallery.map((item, index) => (
            <div key={index} className={styles['carousel-item']}>
              <img className={styles['carousel-image']} src={item.imageUrl} alt={item.description} />
              <h1>{item.description}</h1>
            </div>
          ))}
        </div>
      </div>
        </div>
    
  );
};

export default UserCard;
