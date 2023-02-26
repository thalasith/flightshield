# Create flight details
near call dev-1677446676049-63801520212406 create_flight_details '{"airline": "Westjet", "airline_code": "WS", "flight_number": 200, "scheduled_time": 1678111200000, "departure_city": "Vancouver", "arrival_city": "Manila"}' --accountId XYZ.testnet

# Get flight details
near view dev-1677446676049-63801520212406 get_flight_details_by_id '{"id": 0}' --accountId XYZ.testnet

# Create new journey details
near call dev-1677446676049-63801520212406 create_journey_details '{"confirmation_number": "DEF456", "ticket_number": "5554567891234", "flight_ids": [0], "origin_city":"Vancouver", "destination_city":"Manila", "first_name": "Warlock", "last_name": "Sith"}' --accountId XYZ.testnet

# Get Flight Details by Journey Ticket and Last Name
near view dev-1677446676049-63801520212406 get_journey_details_by_ticket_last_name '{"ticket_number": "5554567891234", "last_name": "Sith"}' --accountId XYZ.testnet

# Get Flight Details for complicated journey
near view dev-1677446676049-63801520212406 get_helper_by_ticket_last_name '{"ticket_number": "5554567891234", "last_name": "Sith"}' --accountId XYZ.testnet

near call dev-1677446676049-63801520212406 create_insurance_details '{"confirmation_number": "DEF456", "ticket_number": "5554567891234", "last_name": "Sith", "first_name": "Warlock", "flight_id": 0 }' --accountId thalassiel.testnet --deposit 1

near view dev-1677446676049-63801520212406 get_insurance_view_details_by_wallet '{"wallet": "thalassiel.testnet"}' --accountId thalassiel.testnet