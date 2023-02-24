import { type NextPage } from "next";
import Head from "next/head";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";

import Header from "~/components/Header";
import { Container } from "~/components/Container";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const SignIn = () => {
    return (
      <button className="mx-1 mb-24 inline-flex items-center justify-center whitespace-nowrap rounded-lg border-4 border-transparent border-primary bg-slate-200 px-4 py-2 text-2xl font-bold text-primary shadow-sm hover:bg-orange-400">
        Connect Your Wallet
      </button>
    );
  };

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
