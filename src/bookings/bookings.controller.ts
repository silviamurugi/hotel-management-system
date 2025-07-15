import { Request, Response } from 'express';
import { createBookingService, deleteBookingService, getAllBookingsService, getBookingByIdService, updateBookingService } from "./bookings.service"
 
export const createBookingController = async(req: Request, res:Response) => {

  try {

    const booking = req.body

    //convert date to date object
    if(booking.check_in_date || booking.check_out_date ){
      booking.check_in_date = new Date(booking.check_in_date)
      booking.check_out_date = new Date(booking.check_out_date);
    }
    const createdBooking = await createBookingService(booking)
    if(!createdBooking) return res.json({message: "Booking not created"})
    return res.status(201).json({message:createdBooking})
    
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
    
  }

}


export const getAllBookingsController = async(req: Request, res:Response) => {
    try {
        const Bookings = await getAllBookingsService()
        if(!Bookings) return res.json({message: "No Bookings found"})
        return res.status(200).json({message: Bookings})

        
    } catch (error :any) {
            return res.status(500).json({ error: error.message });

        
    }
}

export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id); 
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const booking = await getBookingByIdService(id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });


    return res.status(200).json( booking);

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};


export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const bookingData = req.body;
    //convert date to date object
    if(bookingData.check_in_date || bookingData.check_out_date ){
      bookingData.check_in_date = new Date(bookingData.check_in_date)
      bookingData.check_out_date = new Date(bookingData.check_out_date)

















    }


    const existingBooking = await getBookingByIdService(id);
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }


    const updatedBooking = await updateBookingService(id, bookingData);
     if (!updatedBooking) {
            return res.status(400).json({ message: "Booking not updated" });
        }
    return res.status(200).json({ message: "Booking updated successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const existingBooking = await deleteBookingService(id);
    if(!existingBooking){
      return res.status(404).json({ message: "Booking not found" });
    }

    const deletedBooking = await deleteBookingService(id);

    if(!deletedBooking){
      return res.status(400).json({ message: "Booking not deleted" })
    }


    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}