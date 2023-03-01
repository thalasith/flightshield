import { type NextPage } from "next";
import Head from "next/head";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";
import Header from "~/components/Header";
import { InsuranceContainer } from "~/components/InsuranceContainer";

const YourInsurance: NextPage = () => {
  return (
    <>
      <Head>
        <title>FlightShield - Protect against flight delay!</title>
        <meta name="description" content="Protect against flight delay!" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="h-screen">
        <WalletSelectorContextProvider>
          <Header />
          <div className="pt-24">
            <InsuranceContainer />
          </div>
        </WalletSelectorContextProvider>
      </main>
    </>
  );
};

export default YourInsurance;
