import { eq, sql } from "drizzle-orm"
import db from "../Drizzle/db"
// Make sure to import the correct type for bookings; replace 'TIBooking' with the actual exported type if different
import { BookingsTable } from "../Drizzle/schema"
import type { TIBooking } from "../Drizzle/schema" // Only if TIBooking is actually exported as a type

// If 'TIBooking' is not exported, replace 'TIBooking' in your code with the correct type or interface name exported from schema.


export const createBookingService = async(bookings: TIBooking) => {
    const [ inserted ] = await db.insert(BookingsTable).values(bookings).returning()
    if(inserted){
        return "Bookings created successfully"
    }

    return null
}



export const getAllBookingsService = async() => {
    const bookings = await db.query.BookingsTable.findMany()
    return bookings
    
    
}

// get Booking by id
export const getBookingByIdService = async (id: number) => {
    const booking = await db.query.BookingsTable.findFirst({
        where: eq(BookingsTable.booking_id, id)
    })
    return booking;
}


// update Booking by id
export const updateBookingService = async (id: number, booking: TIBooking) => {
    await db.update(BookingsTable).set(booking).where(eq(BookingsTable.booking_id, id))
    return "Booking updated successfully";
}

// delete Booking by id
export const deleteBookingService = async (id: number) => {
    await db.delete(BookingsTable).where(eq(BookingsTable.booking_id, id))
    return "Booking deleted successfully";
}