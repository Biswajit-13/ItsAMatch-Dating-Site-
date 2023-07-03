import React from 'react'
import { getAuth, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import styles from "../styles/Navbar.module.css";

function navbar() {

  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const userId = currentUser.uid;
  
        const profileDoc = doc(db, 'profiles', userId);
        const profileSnapshot = await getDoc(profileDoc);
  
        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
           // Check if profile picture already exists
          if (profileData.profilePic) {
            setProfilePicUrl(profileData.profilePic);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchUserProfile();
  }, []);
const redirectoprofile = () =>{
  router.push("./profile");
}
const redirecttoMatches = ()=>{
  router.push("./Matches");
}
  return (
    <div className={styles.navbar}>
      {profilePicUrl && <img className={styles['navbar-profile-pic']} onClick={redirectoprofile} src={profilePicUrl} alt="Profile" />}
      <div className={styles['navbar-logo']}>Dating App</div>
      <div className={styles['navbar-filter']} onClick={redirecttoMatches}>Matches</div>
    </div>
  )
}

export default navbar;
