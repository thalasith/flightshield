import { Fragment, useCallback, useEffect, useState } from "react";
import { providers, utils } from "near-api-js";
import type { AccountView } from "near-api-js/lib/providers/provider";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import type { Account } from "../interfaces";
import { Popover, Transition, Menu } from "@headlessui/react";
import Link from "next/link";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { GoSignIn, GoSignOut } from "react-icons/go";
import { GiBasketballBall } from "react-icons/gi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

export default function Header() {
  const { selector, modal, accounts, accountId } = useWalletSelector();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleSwitchWallet = () => {
    modal.show();
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

  return (
    <Popover className="fixed z-10 w-full border-b border-gray-600 bg-primary">
      <div className="mx-auto w-10/12 sm:px-6">
        <div className="flex items-center justify-between py-2 ">
          <div className="flex items-center justify-start lg:w-0 lg:flex-1">
            <Link className="flex" href="/">
              <img src="/inverse_full_logo.png" width={400} height={100} />
            </Link>
          </div>
          <div className="hidden flex-row items-start justify-start lg:flex"></div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <div className="hidden items-center lg:flex">
            {account ? (
              <div className="mr-4 text-white">
                Your Balance: {utils.format.formatNearAmount(account.amount, 2)}{" "}
                N{" "}
              </div>
            ) : null}
            {account && (
              <Menu
                as="div"
                className="relative inline-block items-center text-left"
              >
                <div>
                  <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    Wallet Options
                    <ChevronDownIcon
                      className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        <div className="px-2 py-2 text-gray-900">
                          <p className="">Wallet:</p>
                          <p className="">{accountId}</p>
                        </div>
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-orange-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() => {
                              void handleSwitchWallet();
                            }}
                          >
                            {active ? (
                              <HiOutlineSwitchHorizontal
                                className="mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <HiOutlineSwitchHorizontal
                                className="mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                            Switch Wallets
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-orange-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            onClick={() => {
                              void handleSignOut();
                            }}
                          >
                            {active ? (
                              <GoSignOut
                                className="mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <GoSignOut
                                className="mr-2 h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                            Disconnect Wallet
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <Link href="/" className="flex flex-row">
                    <GiBasketballBall className="h-8 w-auto text-orange-600 sm:h-10" />
                    <div className="ml-3 text-2xl font-bold text-slate-800">
                      Library
                    </div>
                  </Link>
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Link
                href="/games"
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-gray-50 hover:text-gray-900"
              ></Link>
              <Link
                href="open_bets"
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-gray-50 hover:text-gray-900"
              ></Link>
              <Link
                href="your_bets"
                className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-gray-50 hover:text-gray-900"
              ></Link>
            </div>

            {account ? (
              <div className="flex flex-col items-center">
                <p className="mb-2 text-center text-slate-200">
                  Your Balance:{" "}
                  <span className="font-extrabold">
                    {utils.format.formatNearAmount(account.amount, 2)} N
                  </span>
                </p>
                <button
                  onClick={() => {
                    void handleSwitchWallet();
                  }}
                  className="mx-1 my-2 inline-flex w-4/5 items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-orange-600 py-1 text-base font-medium text-white shadow-sm hover:bg-orange-400"
                >
                  <HiOutlineSwitchHorizontal
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />{" "}
                  Switch Wallets
                </button>
                <button
                  onClick={() => {
                    void handleSignOut();
                  }}
                  className="mx-1 my-2 inline-flex w-4/5 items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-orange-600 py-1 text-base font-medium text-white shadow-sm hover:bg-orange-400"
                >
                  <GoSignOut className="mr-2 h-5 w-5" aria-hidden="true" />{" "}
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    void handleSignIn();
                  }}
                  className="mx-1 my-2 inline-flex w-4/5 items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-orange-600 py-1 text-base font-medium text-white shadow-sm hover:bg-orange-400"
                >
                  <GoSignIn className="mr-2 h-5 w-5" aria-hidden="true" />{" "}
                  Connect Wallet{" "}
                </button>
              </div>
            )}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
