import { eq, sql } from "drizzle-orm"
import db from "../Drizzle/db"
import { PaymentsTable } from "../Drizzle/schema"
import type { TIPayments } from "../Drizzle/schema"
// TODO: Uncomment and use the correct type if it exists, or define TIPayments here if missing.



export const createPaymentService = async(payments: TIPayments) => {
    const [ inserted ] = await db.insert(PaymentsTable).values(payments).
    returning()
    if(inserted){
        return "Payment created successfully"
    }
    return null
}

export const getAllPaymentsService = async() => {
    const payments = await db.query.PaymentsTable.findMany()
    return payments
    
    
}

// get Payments by id
export const getPaymentByIdService = async (id: number) => {
    const payment = await db.query.PaymentsTable.findFirst({
        where: eq(PaymentsTable.payment_id, id)
    })
    return payment;
}
//get Payments by email


// update Payments by id
export const updatePaymentService = async (id: number, payments: TIPayments) => {
    await db.update(PaymentsTable).set(payments).where(eq(PaymentsTable.payment_id, id))
    return "Payment updated successfully";
}

// delete Payments by id
export const deletePaymentService = async (id: number) => {
    await db.delete(PaymentsTable).where(eq(PaymentsTable.payment_id, id))
    return "Payment deleted successfully";
}