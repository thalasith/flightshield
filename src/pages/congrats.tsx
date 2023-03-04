import { type NextPage } from "next";
import Head from "next/head";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";
import Header from "~/components/Header";
import { InsuranceContainer } from "~/components/InsuranceContainer";
import Link from "next/link";

const Congrats: NextPage = () => {
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

          <div className="mx-auto my-auto flex h-full w-10/12 items-center justify-center pb-4 text-primary">
            <div className="flex-col">
              <h1 className="mb-8 text-6xl font-bold ">
                Flightshield has your back on your flight
              </h1>
              <div className="flex items-center justify-center">
                <img
                  src="/congrats.png"
                  className="mb-2"
                  width={300}
                  height={300}
                />
              </div>
              <div className="text-bold flex items-center justify-center ">
                <button className="rounded border border-orange-300 bg-orange-400 px-4 py-2 text-4xl font-bold text-gray-600 hover:bg-orange-200">
                  <Link href="/your_insurance">Check out your insurance</Link>
                </button>
              </div>
            </div>
          </div>
        </WalletSelectorContextProvider>
      </main>
    </>
  );
};

export default Congrats;
