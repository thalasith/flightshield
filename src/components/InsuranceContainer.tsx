import { useState, useCallback, useEffect } from "react";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import { Contract, providers } from "near-api-js";
import type { CodeResult } from "near-api-js/lib/providers/provider";
import { CONTRACT_ID } from "../constants";
import { getFormattedDate, getFormattedTime } from "../utils/helpers";
import { utils } from "near-api-js";
const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { InsuranceType } from "~/interfaces";

export const InsuranceContainer = () => {
  const { selector, accountId } = useWalletSelector();
  const [insurance, setInsurance] = useState<InsuranceType[]>([]);

  const getInsurance = useCallback(() => {
    const { network } = selector.options;

    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    //base64 encoded id
    const args = JSON.stringify({
      wallet: accountId,
    });

    const base64 = Buffer.from(args).toString("base64");

    return provider
      .query<CodeResult>({
        request_type: "call_function",
        account_id: CONTRACT_ID,
        method_name: "get_insurance_details_by_wallet",
        args_base64: base64,
        finality: "optimistic",
      })
      .then(
        (res) =>
          JSON.parse(Buffer.from(res.result).toString()) as InsuranceType[]
      )
      .catch((err) => {
        console.log("Failed to get items");
        console.error(err);
        return [];
      });
  }, [selector]);

  useEffect(() => {
    getInsurance()
      .then((res) => {
        setInsurance(res);
      })
      .catch((err) => {
        console.log("Failed to get items");
        console.error(err);
      });
  }, [getInsurance]);

  const InsuranceDetails = (props: { insurance: InsuranceType }) => {
    const { insurance } = props;
    return <div>Hi there!</div>;
  };

  return (
    <div className="mx-auto my-auto flex h-full w-10/12 text-gray-600 ">
      {insurance.length < 0 && <div>No insurance purchased! </div>}
      <div className="flex flex-col">
        {insurance.map((item) => {
          return (
            <InsuranceDetails key={item.id} insurance={item as InsuranceType} />
          );
        })}
      </div>
    </div>
  );
};
