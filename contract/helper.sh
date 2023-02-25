# Create flight details
near call dev-1677343906277-35729623103836 create_flight_details '{"airline": "Westjet", "scheduled_time": 1678111200000, "departure_city": "Vancouver", "arrival_city": "Manila"}' --accountId XYZ.testnet
near call dev-1677343906277-35729623103836 create_flight_details '{"airline": "Air Canada", "scheduled_time": 1678111200000, "departure_city": "Calgary", "arrival_city": "Vancouver"}' --accountId thalassiel.testnet

# Get flight details
near view dev-1677343906277-35729623103836 get_flight_details_by_id '{"id": 0}' --accountId XYZ.testnet

# Create new journey details
near call dev-1677343906277-35729623103836 create_journey_details '{"confirmation_number": "DEF456", "ticket_number": "5554567891234", "flight_ids": [0], "origin_city":"Vancouver", "destination_city":"Manila", "first_name": "Warlock", "last_name": "Sith"}' --accountId XYZ.testnet

# Create new journey details
near call dev-1677343906277-35729623103836 create_journey_details '{"confirmation_number": "ABC123", "ticket_number": "1114567891234", "flight_ids": [0], "origin_city":"Vancouver", "destination_city":"Manila", "first_name": "Boris", "last_name": "Tsao"}' --accountId XYZ.testnet


# Create complicated journey details
near call dev-1677343906277-35729623103836 create_journey_details '{"confirmation_number": "GHI789", "ticket_number": "2224567891234", "flight_ids": [0,1], "origin_city":"Calgary", "destination_city":"Manila", "first_name": "Boris", "last_name": "Tsao"}' --accountId XYZ.testnet


# Get Flight Details by Journey Ticket and Last Name
near call dev-1677343906277-35729623103836 get_flight_details_by_journey_ticket_last_name '{"ticket_number": "5554567891234", "last_name": "Sith"}' --accountId XYZ.testnet

# Get Flight Details for complicated journey
near call dev-1677343906277-35729623103836 get_flight_details_by_journey_ticket_last_name '{"ticket_number": "2224567891234", "last_name": "Tsao"}' --accountId XYZ.testnet