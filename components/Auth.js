import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import styles from "../styles/Auth.module.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const authInstance = getAuth();
      if (isRegistering) {
        // Register the user
        await createUserWithEmailAndPassword(authInstance, email, password);
        router.push('/profile');
      } else {
        // Log in the user
        await signInWithEmailAndPassword(authInstance, email, password);
        router.push('/HomePage');
      }
      // Clear the form and error messages
      setEmail("");
      setPassword("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.authTitle}>
        {isRegistering ? "Register" : "Login"}
      </h2>
      {error && <p className={styles.authError}>{error}</p>}
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <input
          className={styles.authInput}
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          className={styles.authInput}
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button className={styles.authButton} type="submit">
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>
      <p
        className={styles.authToggle}
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default Auth;
