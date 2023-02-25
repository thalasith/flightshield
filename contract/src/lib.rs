use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
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
pub enum RentalStatus {
    InGoodStanding,
    Delinquent,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: i64,
    pub user: String,
    pub dob: i64,
    pub rental_status: RentalStatus,
    pub accountNumber: AccountId,
}
#[derive(BorshDeserialize, BorshSerialize, Debug, Serialize, Deserialize, Clone)]
pub struct Rent {
    pub id: i64,
    pub book_id: i64,
    pub user_id: i64,
    pub rental_start_time: u64,
    pub rental_end_time: u64,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct Contract {
    books: Vector<Book>,
    users: Vector<User>,
    rents: Vector<Rent>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            books: Vector::new(b"n"),
            users: Vector::new(b"m"),
            rents: Vector::new(b"o"),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn new_book(&mut self, author_name: String, book_name: String, genre: Genre) {
        let book = Book {
            id: self.books.len() as i64,
            author_name,
            book_name,
            genre,
            rented: false,
        };
        self.books.push(&book);
    }

    pub fn get_books(&self) -> Vec<Book> {
        let mut books = Vec::new();
        for i in 0..self.books.len() {
            books.push(self.books.get(i).unwrap());
        }
        books
    }

    pub fn get_available_books(&self) -> Vec<Book> {
        let mut books = Vec::new();
        for i in 0..self.books.len() {
            let book = self.books.get(i).unwrap();
            if book.rented == false {
                println!("Book being pushed: {}", book.book_name);
                books.push(book.clone());
            }
        }
        books
    }

    pub fn get_rented_books(&self) -> Vec<Book> {
        let mut books = Vec::new();
        for i in 0..self.books.len() {
            let book = self.books.get(i).unwrap();
            if book.rented == true {
                println!("Rented Book being pushed: {}", book.book_name);
                books.push(book.clone());
            }
        }
        books
    }

    pub fn remove_book(&mut self, id: i64) {
        let index = self.books.iter().position(|book| book.id == id);
        match index {
            Some(i) => {
                self.books.swap_remove(i.try_into().unwrap());
            }
            None => env::panic(b"Book not found"),
        }
    }

    pub fn new_user(
        &mut self,
        user: String,
        dob: i64,
        rental_status: RentalStatus,
        accountNumber: AccountId,
    ) {
        let user = User {
            id: self.users.len() as i64,
            user,
            dob,
            rental_status,
            accountNumber,
        };
        self.users.push(&user);
    }

    pub fn get_users(&self) -> Vec<User> {
        let mut users = Vec::new();
        for i in 0..self.users.len() {
            users.push(self.users.get(i).unwrap());
        }
        users
    }

    pub fn remove_user(&mut self, user_id: i64) {
        let index = self.users.iter().position(|user| user.id == user_id);
        match index {
            Some(i) => {
                self.users.swap_remove(i.try_into().unwrap());
            }
            None => env::panic(b"User not found"),
        }
    }

    pub fn check_out(
        &mut self,
        book_id: i64,
        user_id: i64,
        rental_start_time: u64,
        rental_end_time: u64,
    ) {
        let user = self
            .users
            .get((user_id - 1) as u64)
            .expect("User not found");
        let mut book = self
            .books
            .get((book_id - 1) as u64)
            .expect("User not found");

        match book.rented {
            true => env::panic(b"Book already rented"),
            false => {
                book.rented = true;
                let rent = Rent {
                    id: self.rents.len() as i64,
                    book_id,
                    user_id,
                    rental_start_time,
                    rental_end_time,
                };
                self.rents.push(&rent);
                env::log(
                    format!(
                        "Book '{}' has been checked out by user '{}' at {}.",
                        book.book_name, user.user, rental_start_time
                    )
                    .as_bytes(),
                );
            }
        }
    }
}
