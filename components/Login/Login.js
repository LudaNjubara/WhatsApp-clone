import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

import { FcGoogle } from "react-icons/fc";
import styles from "../../styles/Login/Login.module.css";

function Login() {
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error(errorCode, errorMessage);
      });
  };

  return (
    <>
      <Head>
        <title>WhatsApp login</title>
      </Head>

      <main id={styles.pageWrapper}>
        <motion.div
          className={styles.loginWrapper}
          initial={{ opacity: 0, y: 100 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className={styles.logoContainer}>
            <Image
              className={styles.logo}
              src="/images/logo.webp"
              alt="logo"
              width="140"
              height="100"
              priority={true}
            />
          </div>
          <h2 className={styles.welcomeTitle}>Welcome to WhatsApp</h2>
          <p className={styles.welcomeDescription}>Sign in to continue using WhatsApp</p>
          <button type="button" className={styles.signInButton} onClick={signIn}>
            <span>
              <FcGoogle className={styles.signInIcon} />
            </span>
            Sign In With Google
          </button>
        </motion.div>
      </main>
    </>
  );
}

export default Login;
