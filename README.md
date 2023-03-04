#Welcome to Flight Shield

Authors: Boris Tsao, Harrison Chen

Objective:

Flight Shield is our ETHDenver23 buidl submission. The project is our vision for a prospective
flight insurance product targeted towards frequent flyers. Our objective is to showcase several policy claim flows, as well as a purchase flow.

Tech Stack:

- Front-End == T3 (React, Typescript, Tailwind)
- Back-End Protocol / Smart Contract == Near Protocol (Rust)
- Infrastructure / Deployment == Vercel
- Data == Speculative flight/customer journey/insurance policy data

Usage:

- Visit flightshield.vercel.app
- Initiate app through 'Connect Your Wallet' Button
- Connect Your Near Wallet
- Click 'Purchase Insurance' button once connected
- Enter your pre-purchased flight ticket number and last name associated with your ticket
- Review your flight details
- Review Insurance Terms
- Purchase Insurance
- Approve Purchase through Near Wallet
- View Purchased Insurance policies and claim status
- For flights delayed over 2 hours: Checked in customers can receive 20 NEAR
- For flights delayed over 8 hours: Checked in customers can receive 100 NEAR
- Eligible customers can submit policy claims by clicking on claim submission buttons next to policy
  - Otherwise, all other customer types will see 'Nothing to Claim'
- Flights delayed over 2-8 hours can make exactly one claim for 20 NEAR
- Flights delayed over 8 hours can make exactly two claims by clicking on their claim submission button twice
