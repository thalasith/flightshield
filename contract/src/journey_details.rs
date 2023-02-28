use crate::Contract;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

use crate::flight_details::FlightDetails;

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

impl Contract {
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
}
