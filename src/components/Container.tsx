import { Fragment, useCallback, useEffect, useState } from "react";
import type { AccountView } from "near-api-js/lib/providers/provider";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import type { Account } from "../interfaces";
import React from "react";
import PrimaryButton from "./PrimaryButton";

export const Container = () => {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const SignIn = () => {
    return (
      <button className="mx-1 mb-24 inline-flex items-center justify-center whitespace-nowrap rounded-lg border-4 border-transparent border-primary bg-slate-200 px-4 py-2 text-2xl font-bold text-primary shadow-sm hover:bg-orange-400">
        Connect Your Wallet
      </button>
    );
  };
  return (
    <div className="mx-auto my-auto flex h-full w-10/12 items-center">
      <div className="flex-col">
        <h1 className="mb-2 text-6xl font-bold text-white">
          Smooth Journeys Ahead
        </h1>
        <p className="mb-4 text-5xl text-white">Insure against flight delays</p>
        <SignIn />
      </div>
    </div>
  );
};
