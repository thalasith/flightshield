import { useCallback } from "react";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import { parseNearAmount } from "near-api-js/lib/utils/format";
const BOATLOAD_OF_GAS = parseNearAmount("0.00000000003")!;
import { InsuranceType } from "~/interfaces";
import { CONTRACT_ID } from "~/constants";

export const ClaimButton = (props: { insurance: InsuranceType }) => {
  const { selector, accountId } = useWalletSelector();
  const { insurance } = props;
  // 2 hours in milliseconds = 7200000
  const isFlightDelayedFirst =
    insurance.current_scheduled_time - insurance.scheduled_time > 7200000;

  // 8 hours in milliseconds = 28800000
  const isFlightDelayedSecond =
    insurance.current_scheduled_time - insurance.scheduled_time > 28800000;

  const claimFirstInsurance = useCallback(
    async (id: number) => {
      const wallet = await selector.wallet();

      const idInfo = {
        id: id,
      };

      return wallet
        .signAndSendTransaction({
          signerId: accountId!,
          receiverId: CONTRACT_ID,
          callbackUrl: "https://flightshield.vercel.app/test",
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "payout_first_insurance",
                args: idInfo,
                gas: BOATLOAD_OF_GAS,
                deposit: "0",
              },
            },
          ],
        })
        .catch((err) => {
          alert(err);
          console.log(err);
          throw err;
        });
    },
    [selector]
  );

  if (insurance.second_insurance_paid === true) {
    return (
      <div className="w-full rounded bg-green-800 px-4 py-2 text-center text-white">
        All paid out!
      </div>
    );
  } else if (
    insurance.passenger_status != "CheckedIn" &&
    insurance.first_insurance_paid === true &&
    isFlightDelayedSecond
  ) {
    return (
      <div className="w-full rounded bg-green-800 px-4 py-2 text-center text-white">
        Claim second payout!
      </div>
    );
  } else if (insurance.first_insurance_paid === true) {
    return (
      <div className="w-full rounded bg-green-800 px-4 py-2 text-center text-white">
        First claim was paid.
      </div>
    );
  } else if (
    insurance.passenger_status != "NotCheckedIn" &&
    isFlightDelayedFirst
  ) {
    return (
      <button
        onClick={() => void claimFirstInsurance(insurance.id)}
        className="w-full rounded bg-alert px-4 py-2 text-center text-white hover:bg-pink-600 "
      >
        Claim now!
      </button>
    );
  } else {
    return (
      <div className="w-full rounded bg-primary px-4 py-2 text-center text-white">
        Nothing to claim
      </div>
    );
  }
};
