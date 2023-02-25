import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const sample_flight_details = [
  {
    id: 1,
    airline: "Air Canada",
    airline_code: "AC",
    flightNumber: 200,
    confirmation_numbers: ["ABC123", "DEF456", "GHI789"],
    ticket_numbers: ["1234567891234", "1234567891235", "1234567891236"],
    scheduled_time: 1678111200000, // Timestamp in milliseconds for 2023-03-06 06:00:00 (Pacific time)
    estimated_departure_time: null,
    actual_departure_time: null,
    departure_city: "YVR",
    arrival_city: "YYZ",
  },
  {
    id: 1,
    airline: "West Jet",
    airline_code: "WS",
    flightNumber: 123,
    confirmation_numbers: ["ZYX987", "WVU654", "TSR321"],
    ticket_numbers: ["1234567891237", "1234567891238", "1234567891239"],
    scheduled_time: 1678111200000, // Timestamp in milliseconds for 2023-03-06 06:00:00 (Pacific time)
    estimated_departure_time: null,
    actual_departure_time: null,
    departure_city: "YVR",
    arrival_city: "YYZ",
  },
];

export const flightShieldRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
