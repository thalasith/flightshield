import { InsuranceType } from "~/interfaces";
import { getFormattedDateTime } from "../utils/helpers";

const InsuranceColumn = (props: {
  title: string;
  value: string;
  warning: boolean;
}) => {
  const { title, value, warning } = props;
  return (
    <div className="flex flex-col pr-8">
      <div className="">{title}</div>
      <div className={`text-2xl font-bold ${warning ? "text-red-600" : ""}`}>
        {value}
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
    insurance.current_scheduled_time - insurance.scheduled_time > 0;

  const time_flight = isFlightDelayed
    ? insurance.current_scheduled_time
    : insurance.scheduled_time;
  return (
    <div className="w-full rounded-xl border border-gray-300 bg-white pb-2 shadow-lg">
      <div className="flex flex-row items-center justify-between p-2 ">
        <div className="flex flex-row">
          <InsuranceColumn
            title="Journey"
            value={`${insurance.departure_city} to ${insurance.arrival_city}`}
            warning={false}
          />
          <InsuranceColumn
            title="Scheduled Departure Date"
            value={getFormattedDateTime(insurance.scheduled_time)}
            warning={false}
          />
          <InsuranceColumn
            title="Actual Departure Date"
            value={getFormattedDateTime(insurance.current_scheduled_time)}
            warning={isFlightDelayed}
          />

          <InsuranceColumn
            title="Passenger Status"
            value={passengerStatusFormatter(insurance.passenger_status)}
            warning={false}
          />
        </div>
        <div className="rounded bg-primary px-4 py-2 text-white">
          Nothing to claim
        </div>
      </div>
    </div>
  );
};
