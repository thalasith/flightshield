import { useCallback, useEffect, useState } from "react";
import { providers, utils } from "near-api-js";
import type { AccountView } from "near-api-js/lib/providers/provider";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import type { Account } from "../interfaces";
import Link from "next/link";

export const Container = () => {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const getAccount = useCallback(async (): Promise<Account | null> => {
    if (!accountId) {
      return null;
    }

    const { network } = selector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    return provider
      .query<AccountView>({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.options]);

  const handleSignIn = () => {
    modal.show();
  };

  const handleSignOut = async () => {
    const wallet = await selector.wallet();

    wallet.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  };

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    // return void in this promise to avoid React warning
    getAccount()
      .then((nextAccount) => {
        setAccount(nextAccount);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Failed to get account");
        console.error(err);
        setLoading(false);
      });
  }, [accountId, getAccount]);

  const SignIn = () => {
    return (
      <button
        onClick={() => {
          void handleSignIn();
        }}
        className="mx-1 mb-24 inline-flex items-center justify-center whitespace-nowrap rounded-lg border-4 border-transparent border-primary bg-slate-200 px-4 py-2 text-2xl font-bold text-primary shadow-sm hover:bg-orange-400"
      >
        Connect Your Wallet
      </button>
    );
  };

  const BuyInsurance = () => {
    return (
      <Link href="/insurance_details">
        <button className="mx-1 mb-24 inline-flex items-center justify-center whitespace-nowrap rounded-lg border-4 border-transparent border-primary bg-slate-200 px-4 py-2 text-2xl font-bold text-primary shadow-sm hover:bg-orange-400">
          Purchase Insurance
        </button>
      </Link>
    );
  };
  return (
    <div className="mx-auto my-auto flex h-full w-10/12 items-center">
      <div className="flex-col">
        <h1 className="mb-2 text-6xl font-bold text-white">
          Smooth Journeys Ahead
        </h1>
        <p className="mb-4 text-5xl text-white">Insure against flight delays</p>
        {accountId ? <BuyInsurance /> : <SignIn />}
      </div>
    </div>
  );
};
