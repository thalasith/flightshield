import { useState } from "react";
import { getFormattedDate, getFormattedTime } from "../utils/helpers";

const DUMMY_DATA = {
  id: 1,
  airline: "Air Canada",
  airline_code: "AC",
  flightNumber: 200,
  confirmation_numbers: ["ABC123", "DEF456", "GHI789"],
  ticket_numbers: ["1234567891234", "1234567891235", "1234567891236"],
  scheduled_time: 1678111200000, // Timestamp in milliseconds for 2023-03-06 06:00:00 (Pacific time)
  estimated_departure_time: null,
  actual_departure_time: null,
  departure_city: "YVR",
  arrival_city: "YYZ",
};

export const InsuranceCheckout = () => {
  const [step, setStep] = useState(1);
  const [flightDetails, setFlightDetails] = useState(DUMMY_DATA);

  const handleContinue = () => {
    setStep(step + 1);
  };

  const purchaseInsurance = () => {
    console.log("Purchasing insurance");
  };

  const FirstSection = () => {
    return (
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
    );
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
                  {flightDetails.airline}
                </p>
              </div>
              <div>
                <p>Flight Number</p>
                <p className="font-bold text-primary">
                  {flightDetails.flightNumber}
                </p>
              </div>
              <div className="mt-4">
                <p>Departure Flight</p>
                <p className="font-bold text-primary">
                  {getFormattedDate(flightDetails.scheduled_time)}
                </p>
              </div>
              <div className="mt-4">
                <p>Departure Time</p>
                <p className="font-bold text-primary">
                  {getFormattedTime(flightDetails.scheduled_time)}
                </p>
              </div>
              <div className="mt-4">
                <p>Departing City</p>
                <p className="font-bold text-primary">Vancouver (YVR)</p>
              </div>
              <div className="mt-4">
                <p>Arrival City</p>
                <p className="font-bold text-primary">Calgary (YYC)</p>
              </div>
              <div className="mt-4">
                <p>First Name</p>
                <p className="font-bold text-primary">Thalasith</p>
              </div>
              <div className="mt-4">
                <p>Last NAme</p>
                <p className="font-bold text-primary">TealWarlock</p>
              </div>
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
      {step === 1 && <FirstSection />}
      {step === 2 && <SecondSection />}
      {step === 3 && <ThirdSection />}
    </div>
  );
};