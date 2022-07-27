import Head from "next/head";
import BarLoader from "react-spinners/BarLoader";

import styles from "../../styles/LoadingScreen/LoadingScreen.module.css";

function LoadingScreen() {
  return (
    <>
      <Head>
        <title>WhatsApp is loading...</title>
      </Head>

      <div className={styles.loadingScreenContainer}>
        <h2 className={styles.loadingScreenTitle}>Preparing your app...</h2>
        <BarLoader color={"#25d366"} width={"100%"} />
      </div>
    </>
  );
}

export default LoadingScreen;
