use crate::Contract;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};

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

impl Contract {
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
}
