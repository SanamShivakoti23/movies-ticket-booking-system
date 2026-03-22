import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

//  USERS
export const users = pgTable("users", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  email: varchar("email", { length: 100 }).notNull().unique(),

  password: varchar("password", { length: 255 }).notNull(),

  fcmToken: varchar("fcm_token", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//  MOVIES
export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),

  description: text("description"),

  duration: integer("duration").notNull(), // minutes

  genre: varchar("genre", { length: 50 }),

  releaseDate: date("release_date"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//  SHOWTIMES
export const showtimes = pgTable("showtimes", {
  id: serial("id").primaryKey(),

  movieId: integer("movie_id")
    .notNull()
    .references(() => movies.id, { onDelete: "cascade" }),

  theater: varchar("theater", { length: 100 }).notNull(),

  showTime: timestamp("show_time").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

//  SEATS
export const seats = pgTable(
  "seats",
  {
    id: serial("id").primaryKey(),

    showtimeId: integer("showtime_id")
      .notNull()
      .references(() => showtimes.id, { onDelete: "cascade" }),

    seatNumber: varchar("seat_number", { length: 10 }).notNull(),

    isBooked: boolean("is_booked").default(false),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueSeat: uniqueIndex("unique_seat_per_showtime").on(
      table.showtimeId,
      table.seatNumber
    ),
  })
);

//  BOOKINGS
export const bookings = pgTable(
  "bookings",
  {
    id: serial("id").primaryKey(),

    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    seatId: integer("seat_id")
      .notNull()
      .references(() => seats.id, { onDelete: "cascade" }),

    showtimeId: integer("showtime_id")
      .notNull()
      .references(() => showtimes.id, { onDelete: "cascade" }),

    bookingTime: timestamp("booking_time").defaultNow(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueBooking: uniqueIndex("unique_seat_booking").on(
      table.seatId,
      table.showtimeId
    ),
  })
);
