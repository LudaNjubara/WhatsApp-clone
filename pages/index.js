import Head from "next/head";

import MainWindow from "../components/MainWindow/MainWindow";

export default function Home() {
  return (
    <>
      <Head>
        <title>WhatsApp</title>
        <meta name="description" content="WhatsApp Clone" />
      </Head>

      <MainWindow />
    </>
  );
}
