# Create flight details
near call dev-1677343906277-35729623103836 create_flight_details '{"airline": "Westjet", "scheduled_time": 1678111200000, "departure_city": "Vancouver", "arrival_city": "Manila"}' --accountId XYZ.testnet

# Get flight details
near view dev-1677343906277-35729623103836 get_flight_details_by_id '{"id": 0}' --accountId XYZ.testnet

# Create new journey details
near call dev-1677343906277-35729623103836 create_journey_details '{"confirmation_number": "DEF456", "ticket_number": "5554567891234", "flight_ids": [0], "origin_city":"Vancouver", "destination_city":"Manila", "first_name": "Warlock", "last_name": "Sith"}' --accountId XYZ.testnet

# Get Flight Details by Journey Ticket and Last Name
near call dev-1677343906277-35729623103836 create_journey_details '{"ticket_number": "5554567891234", "last_name": "Sith"}' --accountId XYZ.testnet