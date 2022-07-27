import { useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, database } from "../components/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

import Login from "../components/Login/Login";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      setDoc(
        doc(database, "users", user.uid),
        {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    }
  }, [user]);

  return (
    <main id="pageWrapper">
      {loading ? <LoadingScreen /> : !user ? <Login /> : <Component {...pageProps} />}
    </main>
  );
}

export default MyApp;
