use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{Vector, LookupMap};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId};
use std::time::SystemTime;
use chrono::{DateTime,Local, TimeZone};

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
        estimated_departure_time: u64, 
        actual_departure_time: u64, departure_city: String, arrival_city: String){
        
        let scheduled_time = SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap()
        .as_secs();

        let current_scheduled_time = Local.timestamp(scheduled_time as i64, 0);
        let current_plus_three = current_scheduled_time + chrono::Duration::hours(3);
        let estimated_departure_time = current_plus_three.timestamp() as u64;


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
