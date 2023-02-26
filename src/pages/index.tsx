import { type NextPage } from "next";
import Head from "next/head";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";

import Header from "~/components/Header";
import { Container } from "~/components/Container";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>FlightShield - Protect against flight delay!</title>
        <meta name="description" content="Protect against flight delay!" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="bg-image">
        <WalletSelectorContextProvider>
          <Header />
          <Container />
        </WalletSelectorContextProvider>
      </main>
    </>
  );
};

export default Home;
