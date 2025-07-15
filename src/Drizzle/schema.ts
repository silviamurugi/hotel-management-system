import { relations } from "drizzle-orm";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import {
  serial,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// ENUMs
export const RoleEnum = pgEnum("role", ["user", "admin"]);
export const BookingStatusEnum = pgEnum("booking_status", ["Pending", "Confirmed", "Cancelled"]);
export const PaymentStatusEnum = pgEnum("payment_status", ["Pending", "Completed", "Failed"]);
export const TicketStatusEnum = pgEnum("ticket_status", ["Open", "In Progress", "Resolved", "Closed"]);

// Users table
export const UsersTable = pgTable("users", {
  user_id: serial("user_id").primaryKey(),
  first_name: varchar("first_name", { length: 50 }).notNull(),
  last_name: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  contact_phone: text("contact_phone"),
  address: text("address"),
  role: RoleEnum("role").notNull().default("user"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Hotels
export const HotelsTable = pgTable("hotels", {
  hotel_id: serial("hotel_id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  address: text("address"),
  contact_phone: text("contact_phone"),
  category: varchar("category", { length: 50 }),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Rooms
export const RoomsTable = pgTable("rooms", {
  room_id: serial("room_id").primaryKey(),
  hotel_id: integer("hotel_id").notNull().references(() => HotelsTable.hotel_id, { onDelete: "cascade" }),
  room_type: varchar("room_type", { length: 50 }).notNull(),
  price_per_night: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  amenities: text("amenities"),
  is_available: boolean("is_available").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// Bookings
export const BookingsTable = pgTable("bookings", {
  booking_id: serial("booking_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => UsersTable.user_id, { onDelete: "cascade" }),
  room_id: integer("room_id").notNull().references(() => RoomsTable.room_id, { onDelete: "cascade" }),
  check_in_date: timestamp("check_in_date").notNull(),
  check_out_date: timestamp("check_out_date").notNull(),
  total_amount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: BookingStatusEnum("status").notNull().default("Pending"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// Payments

export const PaymentsTable = pgTable("payments", {
  payment_id: serial("payment_id").primaryKey(),
  booking_id: integer("booking_id")
    .notNull()
    .references(() => BookingsTable.booking_id, { onDelete: "cascade" }),
  user_id: integer("user_id")                                // ← Add this line
    .notNull()
    .references(() => UsersTable.user_id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: PaymentStatusEnum("status").notNull().default("Pending"),
  payment_date: timestamp("payment_date").notNull().defaultNow(),
  payment_method: varchar("payment_method", { length: 50 }).notNull(),
  transaction_id: varchar("transaction_id", { length: 100 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});


// Support tickets
export const SupportTicketsTable = pgTable("support_tickets", {
  ticket_id: serial("ticket_id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => UsersTable.user_id, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 200 }).notNull(),
  description: text("description").notNull(),
  status: TicketStatusEnum("status").notNull().default("Open"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

// RELATIONSHIPS

export const UserRelations = relations(UsersTable, ({ many }) => ({
  bookings: many(BookingsTable),
  payments: many(PaymentsTable),
  tickets: many(SupportTicketsTable),
}));

export const HotelRelations = relations(HotelsTable, ({ many }) => ({
  rooms: many(RoomsTable),
}));

export const RoomRelations = relations(RoomsTable, ({ one, many }) => ({
  hotel: one(HotelsTable, {
    fields: [RoomsTable.hotel_id],
    references: [HotelsTable.hotel_id],
  }),
  bookings: many(BookingsTable),
}));

export const BookingRelations = relations(BookingsTable, ({ one, many }) => ({
  user: one(UsersTable, {
    fields: [BookingsTable.user_id],
    references: [UsersTable.user_id],
  }),
  room: one(RoomsTable, {
    fields: [BookingsTable.room_id],
    references: [RoomsTable.room_id],
  }),
  payments: one(PaymentsTable),
}));

export const PaymentRelations = relations(PaymentsTable, ({ one }) => ({
  booking: one(BookingsTable, {
    fields: [PaymentsTable.booking_id],
    references: [BookingsTable.booking_id],
  }),
  user: one(UsersTable, {
    fields: [PaymentsTable.user_id],
    references: [UsersTable.user_id],
  }),
}));

export const TicketRelations = relations(SupportTicketsTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [SupportTicketsTable.user_id],
    references: [UsersTable.user_id],
  }),
}));


export type TIUser =typeof UsersTable.$inferInsert
export type TIHotels = typeof HotelsTable.$inferInsert
export type TIBooking  = typeof BookingsTable.$inferInsert
export type TIPayments  = typeof PaymentsTable.$inferInsert
export type TIRooms = typeof RoomsTable.$inferInsert
export type TISupportTicket =typeof SupportTicketsTable.$inferInsert