import { type NextPage } from "next";
import Head from "next/head";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";
import Header from "~/components/Header";
import { InsuranceCheckout } from "~/components/InsuranceCheckout";

const InsuranceDetails: NextPage = () => {
  return (
    <>
      <Head>
        <title>FlightShield - Protect against flight delay!</title>
        <meta name="description" content="Protect against flight delay!" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main className="h-screen bg-gray-300">
        <WalletSelectorContextProvider>
          <Header />
          <InsuranceCheckout />
        </WalletSelectorContextProvider>
      </main>
    </>
  );
};

export default InsuranceDetails;
