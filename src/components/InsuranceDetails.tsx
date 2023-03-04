import { InsuranceType } from "~/interfaces";
import { ClaimButton } from "./ClaimButton";
import { getFormattedDateTime } from "../utils/helpers";

const InsuranceColumn = (props: {
  title: string;
  value: string;
  value2: string;
  warning: boolean;
}) => {
  const { title, value, value2, warning } = props;
  return (
    <div className="flex w-1/3 flex-col pl-4">
      <div className="">{title}</div>
      <div className={`text-2xl font-bold `}>
        {value}
        <span className={`pl-2 text-sm ${warning ? "text-alert" : ""}`}>
          {value2 === "" ? "" : `(${value2})`}
        </span>
      </div>
    </div>
  );
};

const passengerStatusFormatter = (status: string) => {
  if (status === "NotCheckedIn") {
    return "Not Checked In";
  }
  if (status === "CheckedIn") {
    return "Checked In";
  }
  if (status === "OnBoard") {
    return "On Board";
  }
  if (status === "Landed") {
    return "Landed";
  } else {
    return "Unknown";
  }
};

export const InsuranceDetails = (props: { insurance: InsuranceType }) => {
  const { insurance } = props;
  const isFlightDelayed =
    insurance.current_scheduled_time - insurance.scheduled_time >
    60 * 60 * 1000 * 2;

  const time_flight = isFlightDelayed
    ? insurance.current_scheduled_time
    : insurance.scheduled_time;
  return (
    <div className="my-4 w-full rounded-xl border border-gray-300 bg-blue-100 pb-2 shadow-lg">
      <div className="flex w-full flex-row items-center justify-between p-2">
        <div className="flex w-10/12 flex-row">
          <InsuranceColumn
            title="Journey"
            value={`${insurance.departure_city} to ${insurance.arrival_city}`}
            value2=""
            warning={false}
          />
          <InsuranceColumn
            title="Current Departure Date"
            value={getFormattedDateTime(time_flight)}
            value2={
              isFlightDelayed
                ? `${Math.round(
                    (insurance.current_scheduled_time -
                      insurance.scheduled_time) /
                      (60 * 60 * 1000)
                  )} hr delay`
                : ""
            }
            warning={isFlightDelayed}
          />
          <InsuranceColumn
            title="Passenger Status"
            value={passengerStatusFormatter(insurance.passenger_status)}
            value2=""
            warning={false}
          />
        </div>
        <div className="w-48">
          <ClaimButton insurance={insurance} />
        </div>
      </div>
    </div>
  );
};
