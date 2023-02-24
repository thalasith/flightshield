import { type NextPage } from "next";
import Head from "next/head";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";

import { api } from "~/utils/api";
import Header from "~/components/Header";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>FlightShield - Protect against flight delay!</title>
        <meta name="description" content="Protect against flight delay!" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="">
        <WalletSelectorContextProvider>
          <Header />
          <div className="bg-image">tEST</div>
          {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            
          </div> */}
        </WalletSelectorContextProvider>
      </main>
    </>
  );
};

export default Home;
