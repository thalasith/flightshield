import { InsuranceType } from "~/interfaces";
import { getFormattedDate, getFormattedTime } from "../utils/helpers";

const InsuranceColumn = (props: { title: string; value: string }) => {
  const { title, value } = props;
  return (
    <div className="flex flex-col pr-4">
      <div className="font-bold">{title}</div>
      <div className="text-2xl">{value}</div>
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

  return (
    <div className="w-full rounded bg-white">
      <div className="flex flex-row items-center justify-between p-2 ">
        <div className="flex flex-row">
          <InsuranceColumn
            title="Journey"
            value={`${insurance.departure_city} to ${insurance.arrival_city}`}
          />
          <InsuranceColumn
            title="Departure Date"
            value={getFormattedDate(insurance.scheduled_time)}
          />
          <InsuranceColumn
            title="Scheduled Departure"
            value={getFormattedTime(insurance.scheduled_time)}
          />
          <InsuranceColumn
            title="Passenger Status"
            value={passengerStatusFormatter(insurance.passenger_status)}
          />
        </div>
        <div className="rounded bg-primary px-4 py-2 text-white">
          Nothing to claim
        </div>
      </div>
    </div>
  );
};
