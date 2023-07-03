import { getAuth, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from "../styles/ProfilePage.module.css";

const ProfilePage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('female');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [userId, setUserId] = useState('');
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [id,setId] = useState('');

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
          setName(profileData.name || '');
          setAge(profileData.age || '');
          setGender(profileData.gender || 'female');
          setBio(profileData.bio || '');
          setGalleryImages(profileData.gallery || []);
  
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
  
  

  const handleSaveProfile = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const userId = currentUser.uid;
      const userEmail = currentUser.email;
  
      const profileData = {
        name,
        age,
        gender,
        bio,
        email: userEmail,
        gallery: galleryImages,
        id: userId,
      };
  
      // Save the user profile to Firestore
      await setDoc(doc(db, 'profiles', userId), profileData);
  
      // Check if profile picture already exists
      const profileDoc = doc(db, 'profiles', userId);
      const profileSnapshot = await getDoc(profileDoc);
      if (profileSnapshot.exists()) {
        const profileData = profileSnapshot.data();
        if (profileData.profilePic) {
          // User already has a profile picture, no need to update
          setProfilePicUrl(profileData.profilePic);
          console.log('User profile picture already exists:', profileData.profilePic);
          return;
        }
      }
  
      // Upload profile picture if selected
      if (profilePic) {
        const storageRef = ref(storage, `profilePictures/${userId}`);
        const uploadTask = uploadBytes(storageRef, profilePic);
  
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);
  
        // Update the profile with the download URL of the image
        await setDoc(doc(db, 'profiles', userId), { profilePic: downloadURL }, { merge: true });
        setProfilePicUrl(downloadURL);
  
        console.log('Profile picture uploaded successfully!');
      }
  
      console.log('User profile saved successfully!');
      alert("Your profile is saved")
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };
  
  
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userId = currentUser.uid;
    setUserId(userId);
  };
  
  //upload images for gallery
  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `galleryImages/${userId}/${file.name}`);
    const uploadTask = uploadBytes(storageRef, file);
  
    try {
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Add the new image to the galleryImages state
      setGalleryImages((prevImages) => [
        ...prevImages,
        { imageUrl: downloadURL, description: '' },
      ]);
  
      // Update the uploadedImageUrls state with the new image URL
      setUploadedImageUrls((prevUrls) => [...prevUrls, downloadURL]);
  
      console.log('Gallery image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading gallery image:', error);
    }
  };
  
  
  //image gallery description
  const handleGalleryImageDescriptionChange = (e, index) => {
    const { value } = e.target;
    
    setGalleryImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index].description = value;
      return updatedImages;
    });
  };
  
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log('User LOGGEDOUT');
      alert("User Logged out Successfully!")
      router.push("/index");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className={styles['profile-container']}>
      <h1>Profile Page</h1>
      <div className={styles['profile-form']}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input type="text" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
        <input type="file" onChange={handleProfilePicChange} accept="image/*" />
        {profilePicUrl && <img className={styles['profile-pic']} src={profilePicUrl} alt="Profile Picture" />}
        <button className={styles['save-button']} onClick={handleSaveProfile}>Save Profile</button>
      </div>
  
      <h2>Image Gallery</h2>
      <div className={styles['gallery-container']}>
        <input type="file" onChange={handleGalleryImageUpload} accept="image/*" />
  
        {galleryImages.length > 0 && (
          <div className={styles['gallery-images']}>
            {galleryImages.map((image, index) => (
              <div key={index} className={styles['gallery-image']}>
                <img src={image.imageUrl} alt={`Gallery Image ${index + 1}`} />
                <input
                  type="text"
                  value={image.description}
                  onChange={(e) => handleGalleryImageDescriptionChange(e, index)}
                  placeholder="Image Description"
                />
              </div>
            ))}
          </div>
        )}
        
      </div>
      <div>
      <button className={styles['save-button']} onClick={handleSaveProfile}>Save Image</button>
      </div>
      <button className={styles['logout-button']} onClick={handleLogout}>Logout</button>
    </div>
  );
  
};
export default ProfilePage;
