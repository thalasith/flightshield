#!/bin/sh

./build.sh

if [ $? -ne 0 ]; then
  echo ">> Error building contract"
  exit 1
fi

echo ">> Deploying contract"

# https://docs.near.org/tools/near-cli#near-dev-deploy
near dev-deploy --wasmFile ./target/wasm32-unknown-unknown/release/hello_near.wasm

# get neardev account
source ./neardev/dev-account.env

echo ">> Contract deployed to account $CONTRACT_NAME"
# near call $CONTRACT_NAME create_flight_details '{"airline": "Westjet", "airline_code": "WS", "flight_number": 200, "scheduled_time": 1678111200000, "departure_city": "Vancouver", "arrival_city": "Manila"}' --accountId thalassiel.testnet
