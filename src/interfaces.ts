import type { AccountView } from "near-api-js/lib/providers/provider";

export type Account = AccountView & {
  account_id: string;
};

// make interface nullable
export interface FlightDetails {
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

export interface InsuranceType {
  id: number;
  confirmation_number: string;
  ticket_number: string;
  flight_id: number;
  first_name: string;
  last_name: string;
  first_insurance_paid: boolean;
  second_insurance_paid: boolean;
  premium_amount: number;
  wallet: string;
}
