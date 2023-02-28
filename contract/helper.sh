# get neardev account
source ./neardev/dev-account.env
echo ">> Contract deployed to account $CONTRACT_NAME"

# Create flight details
near call dev-1677473578360-84328941003016 create_flight_details '{"airline": "Westjet", "airline_code": "WS", "flight_number": 200, "scheduled_time": 1678111200000, "departure_city": "Vancouver", "arrival_city": "Manila"}' --accountId thalassiel.testnet

# Create new journey details
near call dev-1677473578360-84328941003016 create_journey_details '{"confirmation_number": "DEF456", "ticket_number": "5554567891234", "flight_ids": [0], "origin_city":"Vancouver", "destination_city":"Manila", "first_name": "Warlock", "last_name": "Sith"}' --accountId thalassiel.testnet

near call dev-1677473578360-84328941003016 create_insurance_details '{"confirmation_number": "DEF456", "ticket_number": "5554567891234", "last_name": "Sith", "first_name": "Warlock", "flight_id": 0 }' --accountId thalassiel.testnet --deposit 1

# near call dev-1677446676049-63801520212406 change_estimated_departure_time '{"flight_id": 0, "new_time": 1678125600000}' --accountId thalassiel.testnet
near call dev-1677473578360-84328941003016 create_flight_details '{"airline": "United Airlines", "airline_code": "UA", "flight_number": 123, "scheduled_time": 1678111200000, "departure_city": "San Francisco", "arrival_city": "Vancouver"}' --accountId thalassiel.testnet

near call dev-1677473578360-84328941003016 create_journey_details '{"confirmation_number": "ABC123", "ticket_number": "1114567891234", "flight_ids": [1], "origin_city":"San Francisco", "destination_city":"Vancouver", "first_name": "Gareth", "last_name": "Williams"}' --accountId thalassiel.testnet
