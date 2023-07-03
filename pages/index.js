import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Auth from '../components/Auth';
import ProfilePage from "./profile";
import HomePage from './HomePage';

const IndexPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {user ? <HomePage /> : <Auth />}
    </div>
  );
};

export default IndexPage;
