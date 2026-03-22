import { db } from "./pg.client";

import { users, movies, showtimes, seats, bookings } from "./schema";

async function seed() {
  console.log("Seeding started...");

  // USERS
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        name: "John Doe",
        email: "john@example.com",
        password: "hashed_password",
        fcmToken: "token123",
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "hashed_password",
      },
    ])
    .returning();

  if (!insertedUsers.length) {
    throw new Error("Users not inserted");
  }

  //  MOVIES
  const insertedMovies = await db
    .insert(movies)
    .values([
      {
        title: "Inception",
        description: "Mind bending movie",
        duration: 148,
        genre: "Sci-Fi",
      },
      {
        title: "Avengers",
        description: "Superhero movie",
        duration: 120,
        genre: "Action",
      },
    ])
    .returning();

  if (!insertedMovies.length) {
    throw new Error(" Movies not inserted");
  }

  //  SHOWTIMES
  const insertedShowtimes = await db
    .insert(showtimes)
    .values([
      {
        movieId: insertedMovies[0]!.id,
        theater: "Theater 1",
        showTime: new Date(),
      },
      {
        movieId: insertedMovies[1]!.id,
        theater: "Theater 2",
        showTime: new Date(),
      },
    ])
    .returning();

  if (!insertedShowtimes.length) {
    throw new Error("Showtimes not inserted");
  }

  //  SEATS
  const seatData: {
    showtimeId: number;
    seatNumber: string;
  }[] = [];

  for (const showtime of insertedShowtimes) {
    for (let i = 1; i <= 10; i++) {
      seatData.push({
        showtimeId: showtime.id,
        seatNumber: `A${i}`,
      });
    }
  }

  const insertedSeats = await db.insert(seats).values(seatData).returning();

  if (!insertedSeats.length) {
    throw new Error("Seats not inserted");
  }

  //  BOOKINGS
  const user = insertedUsers[0]!;
  const seat = insertedSeats[0]!;
  const showtime = insertedShowtimes[0]!;

  await db.insert(bookings).values([
    {
      userId: user.id,
      seatId: seat.id,
      showtimeId: showtime.id,
    },
  ]);

  console.log("Seeding completed successfully!");
}

//  RUN SEED
seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
