import db from "./db"; // Your configured Drizzle DB instance
import { Users, Hotels, Rooms, Bookings, Payments, SupportTickets } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Insert Users
  const insertedUsers = await db.insert(Users).values([
    {
      first_name: "Alice",
      last_name: "Johnson",
      email: "alice@example.com",
      password_hash: "hashed_password_1",
      contact_phone: "+254712345678",
      address: "Nairobi, Kenya",
      role: "user",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      first_name: "Bob",
      last_name: "Smith",
      email: "bob@example.com",
      password_hash: "hashed_password_2",
      contact_phone: "+254798765432",
      address: "Mombasa, Kenya",
      role: "admin",
      created_at: new Date(),
      updated_at: new Date(),
    }
  ]).returning();

  // Insert Hotels
  const insertedHotels = [];
  insertedHotels.push(
    (await db.insert(Hotels).values({
      name: "Ocean View Resort",
      location: "Mombasa",
      address: "Beach Road, Mombasa",
      contact_phone: "+254711223344",
      category: "Resort",
      rating: "4.5",
      created_at: new Date(),
      updated_at: new Date(),
    }).returning())[0]
  );
  insertedHotels.push(
    (await db.insert(Hotels).values({
      name: "City Comfort Hotel",
      location: "Nairobi",
      address: "CBD, Nairobi",
      contact_phone: "+254733445566",
      category: "Business",
      rating: "4.0",
      created_at: new Date(),
      updated_at: new Date(),
    }).returning())[0]
  );

  // Insert Rooms
  const insertedRooms = await db.insert(Rooms).values([
    {
      hotel_id: insertedHotels[0].hotel_id,
      room_type: "Deluxe Suite",
      price_per_night: "150.00",
      capacity: 2,
      amenities: "WiFi, Air Conditioning, Sea View",
      is_available: true,
      created_at: new Date(),
    },
    {
      hotel_id: insertedHotels[0].hotel_id,
      room_type: "Standard Room",
      price_per_night: "80.00",
      capacity: 2,
      amenities: "WiFi, Garden View",
      is_available: true,
      created_at: new Date(),
    },
    {
      hotel_id: insertedHotels[1].hotel_id,
      room_type: "Executive Room",
      price_per_night: "120.00",
      capacity: 2,
      amenities: "WiFi, City View",
      is_available: true,
      created_at: new Date(),
    }
  ]).returning();

  // Insert Bookings
  const insertedBookings = await db.insert(Bookings).values([
    {
      user_id: insertedUsers[0].user_id,
      room_id: insertedRooms[0].room_id,
      check_in_date: new Date("2025-07-05T14:00:00Z"),
      check_out_date: new Date("2025-07-10T10:00:00Z"),
      total_amount: "750.00",
      status: "Confirmed",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: insertedUsers[1].user_id,
      room_id: insertedRooms[2].room_id,
      check_in_date: new Date("2025-07-15T14:00:00Z"),
      check_out_date: new Date("2025-07-18T10:00:00Z"),
      total_amount: "360.00",
      status: "Pending",
      created_at: new Date(),
      updated_at: new Date(),
    }
  ]).returning();

  // Insert Payments
  await db.insert(Payments).values([
    {
      booking_id: insertedBookings[0].booking_id,
      amount: "750.00",
      status: "Completed",
      payment_date: new Date(),
      payment_method: "Credit Card",
      transaction_id: "TXN123456",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      booking_id: insertedBookings[1].booking_id,
      amount: "360.00",
      status: "Pending",
      payment_date: new Date(),
      payment_method: "Mobile Money",
      transaction_id: "TXN654321",
      created_at: new Date(),
      updated_at: new Date(),
    }
  ]);

  // Insert Support Tickets
  await db.insert(SupportTickets).values([
    {
      user_id: insertedUsers[0].user_id,
      subject: "WiFi Not Working",
      description: "The WiFi in my room stopped working after check-in.",
      status: "Open",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      user_id: insertedUsers[1].user_id,
      subject: "Late Check-In Request",
      description: "I will be arriving late. Can I still check in after 10 PM?",
      status: "Resolved",
      created_at: new Date(),
      updated_at: new Date(),
    }
  ]);

  console.log("✅ Seeding completed successfully.");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
});
