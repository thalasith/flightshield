import { type NextPage } from "next";
import Head from "next/head";
import { WalletSelectorContextProvider } from "../contexts/WalletSelectorContext";

import Header from "~/components/Header";
import { Container } from "~/components/Container";
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
          <div className="mx-auto my-auto flex h-full w-10/12 text-gray-600">
            <div className="mx-8 mt-4 w-full flex-col">
              <div className=" flex flex-row items-center justify-between border-b border-gray-400 pb-2">
                <h1 className="text-4xl font-bold">
                  Provide details about your flight
                </h1>
                <p className="align-middle">Step 1 of 3</p>
              </div>
              <div className="mt-4 flex w-full flex-row ">
                <div className="w-1/2 text-xl">
                  Please provide us with your flight details.
                </div>
                <div className="flex w-1/2 flex-col text-lg">
                  <div>
                    <p>Confirmation Number or eTicket Number</p>
                    <input
                      type="text"
                      className="w-full rounded border-2 border-gray-300"
                    />
                  </div>
                  <div className="mt-4">
                    <p>Last Name</p>
                    <input
                      type="text"
                      className="w-full rounded border-2 border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WalletSelectorContextProvider>
      </main>
    </>
  );
};

export default InsuranceDetails;
