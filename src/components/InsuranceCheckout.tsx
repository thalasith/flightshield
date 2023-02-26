import { useState, useCallback } from "react";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import { providers } from "near-api-js";
import type { CodeResult } from "near-api-js/lib/providers/provider";
import { CONTRACT_ID } from "../constants";
import { getFormattedDate, getFormattedTime } from "../utils/helpers";
import { utils } from "near-api-js";
const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;
import { parseNearAmount } from "near-api-js/lib/utils/format";
// make interface nullable
interface FlightDetails {
  ticket_number: string;
  confirmation_number: string;
  flight_id: number;
  airline_code: string;
  flight_number: number;
  first_name: string;
  last_name: string;
  departure_city: string;
  arrival_city: string;
  scheduled_time: number;
}

export const InsuranceCheckout = () => {
  const { selector, accountId } = useWalletSelector();
  const [ticketNumber, setTicketNumber] = useState("");
  const [lastName, setLastName] = useState("");
  const [step, setStep] = useState(1);
  const [flightDetails, setFlightDetails] = useState<FlightDetails>({
    ticket_number: "",
    confirmation_number: "",
    flight_id: 0,
    airline_code: "",
    flight_number: 0,
    first_name: "",
    last_name: "",
    departure_city: "",
    arrival_city: "",
    scheduled_time: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "ticketNumber") {
      setTicketNumber(value);
    } else if (name === "lastName") {
      setLastName(value);
    }
  };

  const getFlightDetails = useCallback(() => {
    const { network } = selector.options;

    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });
    //base64 encoded id
    const args = JSON.stringify({
      ticket_number: "5554567891234",
      last_name: "Sith",
    });

    const base64 = Buffer.from(args).toString("base64");

    return provider
      .query<CodeResult>({
        request_type: "call_function",
        account_id: CONTRACT_ID,
        method_name: "get_helper_by_ticket_last_name",
        args_base64: base64,
        finality: "optimistic",
      })
      .then(
        (res) => JSON.parse(Buffer.from(res.result).toString()) as FlightDetails
      )
      .catch((err) => {
        console.log("Failed to get items");
        console.error(err);
        return [];
      });
  }, [selector]);

  const setInsurance = useCallback(async () => {
    const wallet = await selector.wallet();

    // confirmation_number: String,
    //     ticket_number: String,
    //     last_name: String,
    //     first_name: String,
    //     flight_id: i64,
    const test = {
      ticket_number: flightDetails.ticket_number,
      confirmation_number: flightDetails.confirmation_number,
      flight_id: flightDetails.flight_id,
      last_name: flightDetails.last_name,
      first_name: flightDetails.first_name,
    };

    return wallet
      .signAndSendTransaction({
        signerId: accountId!,
        receiverId: CONTRACT_ID,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "create_insurance_details",
              args: test,
              gas: BOATLOAD_OF_GAS,
              deposit: parseNearAmount("5000000000000000000000000")!,
            },
          },
        ],
      })
      .catch((err) => {
        alert(err);
        console.log(err);
        throw err;
      });
  }, [selector]);

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      getFlightDetails()
        .then((res) => {
          if (Array.isArray(res)) {
            alert("No flight details found");
            return;
          }
          setFlightDetails(res);
          setStep(step + 1);
        })
        .catch((err) => {
          console.log("Failed to get flight details");
          console.error(err);
          return;
        });
    } else {
      setStep(step + 1);
    }
  };

  const purchaseInsurance = () => {
    setInsurance();
    console.log("Purchasing insurance");
  };

  const SecondSection = () => {
    return (
      <div className="mx-8 mt-4 h-1/2 w-full flex-col">
        <div className=" flex flex-row items-center justify-between border-b border-gray-400 pb-2">
          <h1 className="text-4xl font-bold">Review your flight details</h1>
          <p className="align-middle">Step 2 of 3</p>
        </div>
        <div className="mt-4 flex w-full flex-row ">
          <div className="w-1/2 text-xl">
            Please ensure the accuracy of your flight details.
          </div>
          <div className="flex w-1/2 flex-col text-lg">
            <div className="grid grid-cols-2">
              <div className="">
                <p>Airline</p>
                <p className="font-bold text-primary">
                  {flightDetails?.airline_code}
                </p>
              </div>
              <div>
                <p>Flight Number</p>
                <p className="font-bold text-primary">
                  {flightDetails?.flight_number}
                </p>
              </div>
              <div className="mt-4">
                <p>Departure Flight</p>
                <p className="font-bold text-primary">
                  {getFormattedDate(flightDetails?.scheduled_time || 0)}
                </p>
              </div>
              <div className="mt-4">
                <p>Departure Time</p>
                <p className="font-bold text-primary">
                  {getFormattedTime(flightDetails?.scheduled_time || 0)}
                </p>
              </div>
              <div className="mt-4">
                <p>Departing City</p>
                <p className="font-bold text-primary">
                  {flightDetails?.departure_city}
                </p>
              </div>
              <div className="mt-4">
                <p>Arrival City</p>
                <p className="font-bold text-primary">
                  {flightDetails.arrival_city}
                </p>
              </div>
              <div className="mt-4">
                <p>First Name</p>
                <p className="font-bold text-primary">
                  {flightDetails?.first_name}
                </p>
              </div>
              <div className="mt-4">
                <p>Last Name</p>
                <p className="font-bold text-primary">
                  {flightDetails?.last_name}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* TODO: FIX THIS PT-32 */}
        <div className="flex justify-between self-end pt-32">
          <button
            onClick={() => void handlePrevious()}
            className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-orange-400 px-1 py-1 text-xl font-medium shadow-sm"
          >
            Back
          </button>
          <button
            onClick={() => void handleContinue()}
            className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-orange-400 px-1 py-1 text-xl font-medium shadow-sm"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };
  const ThirdSection = () => {
    return (
      <div className="mx-8 mt-4 h-1/2 w-full flex-col">
        <div className=" flex flex-row items-center justify-between border-b border-gray-400 pb-2">
          <h1 className="text-4xl font-bold">Review your insurance details</h1>
          <p className="align-middle">Step 3 of 3</p>
        </div>
        <div className="mt-4 flex w-full flex-row border-b border-gray-400 pb-2 text-lg">
          <div className="w-1/2 text-xl">
            In the event there is a delay, Flight Shield has you covered.
          </div>
          <div className="flex w-1/2 flex-col ">
            <p>
              To receive any payment, you must be{" "}
              <span className="font-bold text-green-800">
                checked in to your flight and past security at the airport
              </span>{" "}
              at the time of delay.
            </p>
            <p className="mt-2">
              If your flight is delayed 2 to 8 hours, you wil receive{" "}
              <span className="font-bold text-primary">USD 40</span>.
            </p>
            <p className="mt-2">
              If your flight is delayed 8+ hours, you wil receive{" "}
              <span className="font-bold text-primary">USD 500</span>.
            </p>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-row border-b border-gray-400 pb-2 text-lg">
          <div className="w-1/2 text-xl">
            The amount you pay for the coverage.
          </div>
          <div className="flex w-1/2 flex-col pr-6 ">
            <div className="flex flex-row justify-between">
              <div className="">
                <p>Premium:</p>
              </div>
              <div>
                <p>USD 20.00</p>
              </div>
            </div>
            <div className="flex flex-row justify-between border-b border-gray-400">
              <div className="">
                <p>Taxes:</p>
              </div>
              <div>
                <p>USD 2.50</p>
              </div>
            </div>
            <div className="flex flex-row justify-between py-2 font-bold">
              <div className="">
                <p>Total:</p>
              </div>
              <div>
                <p>USD 22.50</p>
              </div>
            </div>
          </div>
        </div>
        {/* TODO: FIX THIS PT-32 */}
        <div className="flex justify-end self-end pt-16">
          <button
            onClick={() => void purchaseInsurance()}
            className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-orange-400 px-1 py-1 text-xl font-medium shadow-sm"
          >
            Purchase Insurance
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto my-auto flex h-full w-10/12 text-gray-600">
      {step === 1 && (
        <div className="mx-8 mt-4 h-1/2 w-full flex-col">
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
                  name="ticketNumber"
                  value={ticketNumber}
                  onChange={(e) => void handleChange(e)}
                  className="w-full rounded border-2 border-gray-300"
                />
              </div>
              <div className="mt-4">
                <p>Last Name</p>
                <input
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => void handleChange(e)}
                  className="w-full rounded border-2 border-gray-300"
                />
              </div>
            </div>
          </div>
          {/* TODO: FIX THIS PT-32 */}
          <div className="flex justify-end self-end pt-32">
            <button
              onClick={() => void handleContinue()}
              className="mx-1 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-orange-400 px-1 py-1 text-xl font-medium shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {step === 2 && <SecondSection />}
      {step === 3 && <ThirdSection />}
    </div>
  );
};
