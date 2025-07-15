import db from "../../src/Drizzle/db"
import { createPaymentService, deletePaymentService, getAllPaymentsService, getPaymentByIdService, updatePaymentService } from "../../src/payment/payment.service"
import {  PaymentsTable,  } from "../../src/Drizzle/schema"

jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        PaymentsTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
    
        }
    }
}))


beforeEach(() => {
    jest.clearAllMocks()
})

describe("Payment service", () =>{
    describe("Create Payment service", () => {
        it("should insert a Payment and return the inserted Payment", async () => {
            const payment = {
            payment_id: 1,
            booking_id: 1,
            user_id: 1, 
            amount: "75000.00",
            status: "Completed" as "Completed",
            payment_date: new Date("2025-07-06"),
            payment_method: "MPESA",
            transaction_id: "TX111",
            created_at: new Date(),
            updated_at: new Date() 

            };
            const inserted = { id: 1, ...payment };
            //chaining - checking behaviour of the db
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([inserted])
                })
    
            });
    
            const result = await createPaymentService(payment)
            expect(db.insert).toHaveBeenCalledWith(PaymentsTable)
            expect(result).toEqual("Payment created successfully")
    
        })
    
        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockReturnValueOnce([null])
                })
            })
    
    
            const payment = {
            payment_id: 1,
            booking_id: 1,
            user_id: 1, 
            amount: "75000.00",
            status: "Completed" as "Completed",
            payment_date: new Date("2025-07-06"),
            payment_method: "MPESA",
            transaction_id: "TX111",
            created_at: new Date(),
            updated_at: new Date() 

            };
    
            const result = await createPaymentService(payment)
            expect(result).toBeNull()
        })
    
      
    
    })
    
    
    describe("get Payment service", () => {
          it("should get all Payments", async() => {
            const payments = [
                {
                    payment_id: 1,
                    booking_id: 1,
                    user_id: 1, 
                    amount: "75000.00",
                    status: "Completed" as "Completed",
                    payment_date: new Date("2025-07-06"),
                    payment_method: "MPESA",
                    transaction_id: "TX111"
                },
                {
                    payment_id: 2,
                    booking_id: 2,
                    user_id: 2, 
                    amount: "75000.00",
                    status: "Completed" as "Completed",
                    payment_date: new Date("2025-07-06"),
                    payment_method: "MPESA",
                    transaction_id: "TX111"
                }
            ];
    
            (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValue(payments)
    
            const result = await getAllPaymentsService()
            expect(result).toEqual(payments)
            expect(db.query.PaymentsTable.findMany).toHaveBeenCalled()
          })
          it("should return an empty array if no Payments are found", async () => {
            (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValue([])

            const result = await getAllPaymentsService()
            expect(result).toEqual([])
            expect(db.query.PaymentsTable.findMany).toHaveBeenCalled()
          })


            
        
    })


    describe("getTodoByIdService", () => {
        it("should get a Payment by id", async () => {
            const Payment = {
                    payment_id: 1,
                    booking_id: 1,
                    user_id: 1, 
                    amount: "75000.00",
                    status: "Completed" as "Completed",
                    payment_date: new Date("2025-07-06"),
                    payment_method: "MPESA",
                    transaction_id: "TX111"
            };

            (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValue(Payment)

            const result = await getPaymentByIdService(1)
            expect(result).toEqual(Payment)
            expect(db.query.PaymentsTable.findFirst).toHaveBeenCalledWith({
                where: expect.any(Object)
            })
        })

        it("should return null if no Payment is found", async () => {
            (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValue(null)

            const result = await getPaymentByIdService(999)
            expect(result).toBeNull()
            expect(db.query.PaymentsTable.findFirst).toHaveBeenCalledWith({
                where: expect.any(Object)
            })
        
    })

  })


describe("Update Payment service", () => {
   it("should update a Payment by id", async () => {

    const whereMock = jest.fn().mockResolvedValue(undefined);
    const setMock = jest.fn().mockReturnValue({ where: whereMock });
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    const result = await updatePaymentService(1, {
                    payment_id:1,
                    booking_id: 1,
                    user_id: 1,
                    amount: "75000",
                    status: "Completed" as "Completed",
                    payment_method: "MPESA",
                    transaction_id: "TX111"
    });

    expect(result).toEqual("Payment updated successfully");
    expect(db.update).toHaveBeenCalledWith(PaymentsTable);
    expect(setMock).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
   })
    
  })

  describe("Delete Payment service", () => {
    it("should delete a Payment by id", async () => {
    const whereMock = jest.fn().mockResolvedValue(undefined);
    const deleteMock = jest.fn().mockReturnValue({ where: whereMock });

    (db.delete as jest.Mock) = deleteMock;

    const result = await deletePaymentService(1);

    expect(result).toEqual("Payment deleted successfully");
    expect(deleteMock).toHaveBeenCalledWith(PaymentsTable);
    expect(whereMock).toHaveBeenCalled();
});

  })



})