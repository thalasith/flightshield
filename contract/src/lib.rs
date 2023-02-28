use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::{env, json_types::U128, near_bindgen, AccountId, Promise};

use flight_details::FlightDetails;
use insurance_details::{InsuranceDetails, InsuranceViewDetails};
use journey_details::{JourneyDetails, PassengerStatus};

mod flight_details;
mod insurance_details;
mod journey_details;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct Contract {
    flight_vec: Vector<FlightDetails>,
    journey_vec: Vector<JourneyDetails>,
    insurance_vec: Vector<InsuranceDetails>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            flight_vec: Vector::new(b"n"),
            journey_vec: Vector::new(b"m"),
            insurance_vec: Vector::new(b"p"),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn new(&mut self) {
        println!("Iterate over json objects, populate vectors");
    }

    #[payable]
    pub fn create_insurance_details(
        &mut self,
        confirmation_number: String,
        ticket_number: String,
        last_name: String,
        first_name: String,
        flight_id: i64,
    ) {
        // assert that the deposit is more than 0
        assert!(env::attached_deposit() > 0, "Deposit must be more than 0");

        let insurance_details = InsuranceDetails {
            id: self.insurance_vec.len() as i64,
            confirmation_number: confirmation_number.clone(),
            ticket_number: ticket_number.clone(),
            flight_id: flight_id,
            first_name: first_name.clone(),
            last_name: last_name.clone(),
            first_insurance_paid: false,
            second_insurance_paid: false,
            premium_amount: env::attached_deposit(),
            wallet: env::signer_account_id(),
        };
        self.insurance_vec.push(&insurance_details);
    }

    pub fn get_insurance_details_by_id(&self, id: i64) -> Option<InsuranceDetails> {
        self.insurance_vec.get(id as u64)
    }

    pub fn get_insurance_details_by_wallet(&self, wallet: AccountId) -> Vec<InsuranceDetails> {
        let mut insurance_details = Vec::new();
        for i in 0..self.insurance_vec.len() {
            let insurance = self.insurance_vec.get(i).unwrap();
            if insurance.wallet == wallet {
                insurance_details.push(insurance);
            }
        }
        assert!(insurance_details.len() > 0, "No insurance details found");
        insurance_details
    }

    pub fn get_insurance_view_details_by_wallet(
        &self,
        wallet: AccountId,
    ) -> Vec<InsuranceViewDetails> {
        let mut insurance_details = Vec::new();
        for i in 0..self.insurance_vec.len() {
            let insurance = self.insurance_vec.get(i).unwrap();
            if insurance.wallet == wallet {
                let flight = self.flight_vec.get(insurance.flight_id as u64).unwrap();
                // get the latest flight time
                let flight_times = [
                    flight.scheduled_time.clone(),
                    flight.estimated_departure_time.clone(),
                    flight.actual_departure_time.clone(),
                ];
                // query the
                let latest_flight_time = *flight_times.iter().max().unwrap();
                // get the journey details by ticket number and last name
                let journey = self.get_journey_details_by_ticket_last_name(
                    insurance.ticket_number.clone(),
                    insurance.last_name.clone(),
                );

                let insurance_view_details = InsuranceViewDetails {
                    id: insurance.id,
                    confirmation_number: insurance.confirmation_number.clone(),
                    ticket_number: insurance.ticket_number.clone(),
                    flight_id: insurance.flight_id,
                    first_name: insurance.first_name.clone(),
                    last_name: insurance.last_name.clone(),
                    current_scheduled_time: latest_flight_time,
                    passenger_status: journey.unwrap().passenger_status.clone(),
                    first_insurance_paid: insurance.first_insurance_paid,
                    second_insurance_paid: insurance.second_insurance_paid,
                    premium_amount: insurance.premium_amount,
                    departure_city: flight.departure_city.clone(),
                    arrival_city: flight.arrival_city.clone(),
                    scheduled_time: flight.scheduled_time.clone(),
                    wallet: insurance.wallet.clone(),
                };
                insurance_details.push(insurance_view_details);
            }
        }
        assert!(insurance_details.len() > 0, "No insurance details found");
        insurance_details
    }

    pub fn payout_first_insurance(&mut self, id: u64) {
        let mut insurance = self.insurance_vec.get(id as u64).unwrap();
        let account_id = insurance.wallet.clone();
        let flight = self.flight_vec.get(insurance.flight_id as u64).unwrap();
        // get the latest flight time
        let flight_times = [
            flight.scheduled_time.clone(),
            flight.estimated_departure_time.clone(),
            flight.actual_departure_time.clone(),
        ];
        let latest_flight_time = *flight_times.iter().max().unwrap();

        let journey = self
            .get_journey_details_by_confirmation_number(insurance.confirmation_number.clone())
            .unwrap();

        let passenger_status = journey.passenger_status;

        assert!(
            std::mem::discriminant(&passenger_status)
                != std::mem::discriminant(&PassengerStatus::NotCheckedIn),
            "Passenger is not checked in."
        );

        assert!(
            account_id == env::signer_account_id(),
            "Only the wallet can payout"
        );

        assert!(
            insurance.first_insurance_paid == false,
            "First insurance already paid"
        );

        assert!(
            latest_flight_time - flight.scheduled_time > 7200000 as u64,
            "Flight is not delayed for more than 2 hours"
        );

        // change the insurance status of first insurance paid to true
        insurance.first_insurance_paid = true;
        // delete the old insurance
        self.insurance_vec.replace(id, &insurance);

        let insurance_payout = U128::from(5000000000000000000000000);

        Promise::new(account_id).transfer(insurance_payout.0);
    }

    pub fn payout_second_insurance(&mut self, id: u64) {
        let mut insurance = self.insurance_vec.get(id as u64).unwrap();
        let account_id = insurance.wallet.clone();
        let flight = self.flight_vec.get(insurance.flight_id as u64).unwrap();
        // get the latest flight time
        let flight_times = [
            flight.scheduled_time.clone(),
            flight.estimated_departure_time.clone(),
            flight.actual_departure_time.clone(),
        ];
        let latest_flight_time = *flight_times.iter().max().unwrap();

        let journey = self
            .get_journey_details_by_confirmation_number(insurance.confirmation_number.clone())
            .unwrap();

        let passenger_status = journey.passenger_status;

        assert!(
            std::mem::discriminant(&passenger_status)
                != std::mem::discriminant(&PassengerStatus::NotCheckedIn),
            "Passenger is not checked in."
        );

        assert!(
            account_id == env::signer_account_id(),
            "Only the wallet can payout"
        );

        assert!(
            insurance.first_insurance_paid == true,
            "First insurance hasn't been paid out"
        );

        assert!(
            insurance.second_insurance_paid == false,
            "Second insurance already paid"
        );

        assert!(
            latest_flight_time - flight.scheduled_time > 28800000 as u64,
            "Flight is not delayed for more than 8 hours"
        );

        // change the insurance status of first insurance paid to true
        insurance.second_insurance_paid = true;
        // delete the old insurance
        self.insurance_vec.replace(id, &insurance);

        let insurance_payout = U128::from(20000000000000000000000000);

        Promise::new(account_id).transfer(insurance_payout.0);
    }
}
