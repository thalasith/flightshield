import { useState, useCallback } from "react";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import { Contract, providers } from "near-api-js";
import type { CodeResult } from "near-api-js/lib/providers/provider";
import { CONTRACT_ID } from "../constants";
import { getFormattedDate, getFormattedTime } from "../utils/helpers";
import { utils } from "near-api-js";
const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;
import { parseNearAmount } from "near-api-js/lib/utils/format";

export const InsuranceDetails = () => {
  const { selector, accountId } = useWalletSelector();

  const [insuranceDetails, setInsuranceDetails] = useState({});

  return <div>TESTING</div>;
};
