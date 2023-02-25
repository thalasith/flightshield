use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{Vector, LookupMap};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId};

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize, Clone)]
pub struct JourneyDetails {
    pub id: i64,
    pub confirmation_number: String,
    pub ticket_number: String,
    pub passenger_status: PassengerStatus,
    pub flight_id: i64,
    pub first_name: String,
    pub origin_city: String,
    pub destination_city: String,
    pub connections: Option<String>,
    pub last_name: String,
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
pub struct InsuranceDetails {
    pub id: i64,
    pub confirmation_number: String,
    pub ticket_number: String,
    pub flight_id: i64,
    pub first_name: String,
    pub last_name: String,
    pub first_insurance_paid: bool,
    pub second_insurance_paid: bool,
    pub premium_amount: i32,
    pub wallet: String
}
#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize)]
pub struct FlightDetails {
    pub id: i64,
    pub confirmation_number: String,
    pub ticket_number: String,
    pub airline: String,
    pub scheduled_time: u64,
    pub estimated_departure_time: u64,
    pub actual_departure_time: u64,
    pub departure_city: String,
    pub arrival_city: String


}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct Contract {
    flight_vec: Vector<FlightDetails>,
    journey_vec: Vector<JourneyDetails>,
    insurance_vec: Vector<InsuranceDetails>
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            flight_vec: Vector::new(b"n"),
            journey_vec: Vector::new(b"m"),
            insurance_vec: Vector::new(b"o"),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn new(&mut self) {
        println!("Iterate over json objects, populate vectors");
    }

    pub fn create_flight_details(&mut self, confirmation_number: String, ticket_number: String, airline: String, 
        scheduled_time: u64, estimated_departure_time: u64, 
        actual_departure_time: u64, departure_city: String, arrival_city: String){
        let flight = FlightDetails {
            id: self.flight_vec.len() as i64,
            confirmation_number,
            ticket_number,
            airline,
            scheduled_time,
            estimated_departure_time,
            actual_departure_time,
            departure_city,
            arrival_city
        };
        self.flight_vec.push(&flight)

    }
}
