use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, json_types::U128, near_bindgen, AccountId, Promise};

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize)]
pub struct FlightDetails {
    pub id: i64,
    pub confirmation_number: Option<Vec<String>>,
    pub ticket_number: Option<Vec<String>>,
    pub airline: String,
    pub scheduled_time: u64,
    pub estimated_departure_time: u64,
    pub actual_departure_time: u64,
    pub departure_city: String,
    pub arrival_city: String,
    pub airline_code: String,
    pub flight_number: u64,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize, Clone)]
pub enum PassengerStatus {
    NotCheckedIn,
    CheckedIn,
    Cancelled,
    OnBoard,
    InFlight,
    Arrived,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize, Clone)]
pub struct JourneyDetails {
    pub id: i64,
    pub confirmation_number: String,
    pub ticket_number: String,
    pub passenger_status: PassengerStatus,
    pub flight_ids: Vec<i64>,
    pub origin_city: String,
    pub destination_city: String,
    pub first_name: String,
    pub last_name: String,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize)]
pub struct InsuranceHelper {
    pub ticket_number: String,
    pub confirmation_number: String,
    pub flight_id: i64,
    pub airline_code: String,
    pub flight_number: u64,
    pub first_name: String,
    pub last_name: String,
    pub departure_city: String,
    pub arrival_city: String,
    pub scheduled_time: u64,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize, Clone)]
pub struct InsuranceDetails {
    pub id: i64,
    pub confirmation_number: String,
    pub ticket_number: String,
    pub flight_id: i64,
    pub first_name: String,
    pub last_name: String,
    pub first_insurance_paid: bool,
    pub second_insurance_paid: bool,
    pub premium_amount: u128,
    pub wallet: AccountId,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize, Clone)]
pub struct InsuranceViewDetails {
    pub id: i64,
    pub confirmation_number: String,
    pub ticket_number: String,
    pub flight_id: i64,
    pub departure_city: String,
    pub arrival_city: String,
    pub scheduled_time: u64,
    pub current_scheduled_time: u64,
    pub passenger_status: PassengerStatus,
    pub first_name: String,
    pub last_name: String,
    pub first_insurance_paid: bool,
    pub second_insurance_paid: bool,
    pub premium_amount: u128,
    pub wallet: AccountId,
}

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

    pub fn create_flight_details(
        &mut self,
        airline: String,
        scheduled_time: u64,
        airline_code: String,
        flight_number: u64,
        departure_city: String,
        arrival_city: String,
    ) {
        let flight = FlightDetails {
            id: self.flight_vec.len() as i64,
            confirmation_number: None,
            ticket_number: None,
            airline,
            scheduled_time,
            flight_number,
            airline_code,
            estimated_departure_time: scheduled_time,
            actual_departure_time: scheduled_time,
            departure_city,
            arrival_city,
        };
        self.flight_vec.push(&flight)
    }

    pub fn add_confirmation_code(&mut self, flight_id: i64, confirmation_code: String) {
        let mut flight = self.flight_vec.get(flight_id as u64).unwrap();
        let mut confirmation_code_vec = flight.confirmation_number.unwrap_or_default();
        confirmation_code_vec.push(confirmation_code);
        flight.confirmation_number = Some(confirmation_code_vec);
        self.flight_vec.replace(flight_id as u64, &flight);
    }

    pub fn add_ticket_number(&mut self, flight_id: i64, ticket_number: String) {
        let mut flight = self.flight_vec.get(flight_id as u64).unwrap();
        let mut ticket_number_vec = flight.ticket_number.unwrap_or_default();
        ticket_number_vec.push(ticket_number);
        flight.ticket_number = Some(ticket_number_vec);
        self.flight_vec.replace(flight_id as u64, &flight);
    }

    pub fn get_flight_details_by_id(&self, id: i64) -> Option<FlightDetails> {
        self.flight_vec.get(id as u64)
    }

    pub fn change_estimated_departure_time(&mut self, flight_id: i64, new_time: u64) {
        let mut flight = self.flight_vec.get(flight_id as u64).unwrap();
        flight.estimated_departure_time = new_time;
        flight.actual_departure_time = new_time;
        self.flight_vec.replace(flight_id as u64, &flight);
    }

    pub fn change_actual_departure_time(&mut self, flight_id: i64, new_time: u64) {
        let mut flight = self.flight_vec.get(flight_id as u64).unwrap();
        flight.actual_departure_time = new_time;
        self.flight_vec.replace(flight_id as u64, &flight);
    }

    pub fn create_journey_details(
        &mut self,
        confirmation_number: String,
        ticket_number: String,
        flight_ids: Vec<i64>,
        origin_city: String,
        destination_city: String,
        first_name: String,
        last_name: String,
    ) {
        let new_flight_ids = flight_ids.clone();
        let journey = JourneyDetails {
            id: self.journey_vec.len() as i64,
            confirmation_number,
            ticket_number,
            passenger_status: PassengerStatus::NotCheckedIn,
            flight_ids,
            origin_city,
            destination_city,
            first_name,
            last_name,
        };
        self.journey_vec.push(&journey);

        // for every flight, push the confirmation code to the flight_Details
        for flight_id in new_flight_ids {
            self.add_confirmation_code(flight_id, journey.confirmation_number.clone());
            self.add_ticket_number(flight_id, journey.ticket_number.clone());
        }
    }

    pub fn get_journey_details(&self, id: i64) -> Option<JourneyDetails> {
        self.journey_vec.get(id as u64)
    }

    // return a list of flight details from the journey's flight_ids
    pub fn get_flight_details_by_journey_ticket_last_name(
        &self,
        ticket_number: String,
        last_name: String,
    ) -> Vec<FlightDetails> {
        let mut flight_details = Vec::new();
        for i in 0..self.journey_vec.len() {
            let journey = self.journey_vec.get(i).unwrap();
            if journey.ticket_number == ticket_number && journey.last_name == last_name {
                for flight_id in journey.flight_ids {
                    let flight = self.flight_vec.get(flight_id as u64).unwrap();
                    flight_details.push(flight);
                }
            }
        }
        assert!(flight_details.len() > 0, "No flight details found");
        flight_details
    }

    pub fn get_journey_details_by_ticket_last_name(
        &self,
        ticket_number: String,
        last_name: String,
    ) -> Option<JourneyDetails> {
        for i in 0..self.journey_vec.len() {
            let journey = self.journey_vec.get(i).unwrap();
            if journey.ticket_number == ticket_number && journey.last_name == last_name {
                return Some(journey);
            }
        }
        None
    }

    pub fn change_passenger_status_by_ticket_last_name(
        &mut self,
        ticket_number: String,
        last_name: String,
    ) {
        let journey = self.get_journey_details_by_ticket_last_name(ticket_number, last_name);

        if journey.is_none() {
            return;
        }

        let journey = journey.unwrap();
        let mut journey = self.journey_vec.get(journey.id as u64).unwrap();
        journey.passenger_status = PassengerStatus::CheckedIn;
        self.journey_vec.replace(journey.id as u64, &journey);
    }

    pub fn get_journey_details_by_confirmation_number(
        &self,
        confirmation_number: String,
    ) -> Option<JourneyDetails> {
        self.journey_vec
            .iter()
            .find(|journey| journey.confirmation_number == confirmation_number)
            .clone()
    }

    pub fn get_helper_by_ticket_last_name(
        &self,
        ticket_number: String,
        last_name: String,
    ) -> Option<InsuranceHelper> {
        let journey = self.get_journey_details_by_ticket_last_name(ticket_number, last_name);
        if journey.is_none() {
            return None;
        }
        let journey = journey.unwrap();
        let flight = self.flight_vec.get(journey.flight_ids[0] as u64).unwrap();
        let insurance_helper = InsuranceHelper {
            ticket_number: journey.ticket_number.clone(),
            confirmation_number: journey.confirmation_number.clone(),
            flight_id: flight.id.clone(),
            airline_code: flight.airline_code.clone(),
            flight_number: flight.flight_number.clone(),
            first_name: journey.first_name.clone(),
            last_name: journey.last_name.clone(),
            departure_city: journey.origin_city.clone(),
            arrival_city: journey.destination_city.clone(),
            scheduled_time: flight.scheduled_time.clone(),
        };
        Some(insurance_helper)
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
