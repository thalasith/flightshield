# Create flight details
near call dev-1677902237978-18668962545284 create_flight_details '{"airline": "United Airlines",  "airline_code": "UA", "flight_number": 1460 , "scheduled_time": 1678104600000, "departure_city": "Vancouver", "arrival_city": "Denver"}' --accountId thalassiel.testnet

# Create new journey details
near call dev-1677902237978-18668962545284 create_journey_details '{"confirmation_number": "XYZ123", "ticket_number": "4541492349347", "flight_ids": [0], "origin_city":"Vancouver", "destination_city":"Denver", "first_name": "Boris", "last_name": "Tsao"}' --accountId thalassiel.testnet

near call dev-1677902237978-18668962545284 change_estimated_departure_time '{"flight_id": 3, "new_time": 1678140300000}' --accountId thalassiel.testnet

near call dev-1677902237978-18668962545284 change_passenger_status_by_ticket_last_name '{"ticket_number": "4541492349347", "last_name": "Tsao"}' --accountId thalassiel.testnet