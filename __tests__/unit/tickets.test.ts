import db from "../../src/Drizzle/db"
import { createTicketService, deleteSupportTicketService, getAllSupportTicketsService, getSupportTicketByIdService, updateSupportTicketService } from "../../src/supportTicket/supportTicket.service"
import {  SupportTicketsTable,  } from "../../src/Drizzle/schema"

jest.mock("../../src/Drizzle/db", () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        SupportTicketsTable: {
            findMany: jest.fn(),
            findFirst: jest.fn()
    
        }
    }
}))


beforeEach(() => {
    jest.clearAllMocks()
})

describe("SupportTicket service", () =>{
    describe("Create SupportTicket service", () => {
        it("should insert a SupportTicket and return the inserted SupportTicket", async () => {
            const supportTicket = {
                user_id: 1,
                subject: "Test subject",
                description: "Test description",
                status: "Open" as "Open",
                created_at: new Date(),
                updated_at: new Date()
            }
            const inserted = { id: 1, ...supportTicket };
            //chaining - checking behaviour of the db
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([inserted])
                })
    
            });
    
            const result = await createTicketService(supportTicket)
            expect(db.insert).toHaveBeenCalledWith(SupportTicketsTable)
            expect(result).toEqual("Support ticket created successfully")
    
        })
    
        it("should return null if insertion fails", async () => {
            (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockReturnValueOnce([null])
                })
            })
    
    
            const supportTicket = {
                user_id: 1,
                subject: "Test subject",
                description: "Test description",
                status: "Open" as "Open",
                created_at: new Date(),
                updated_at: new Date()
            }
    
            const result = await createTicketService(supportTicket)
            expect(result).toBeNull()
        })
    
      
    
    })
    
    
    describe("get support ticket service", () => {
          it("should get all tickets", async() => {
            const tickets = [
                {
                  ticketId: 1,
            user_Id: 1,
            subject: "Early Check-in Request",
            description: "Can I check in at 10am instead of 2pm?",
            status: "Open" as "Open",
            created_At: null,
            updated_At: null
                },
                {
                   ticketId: 2,
            user_Id: 3,
            subject: "Late Check-in Request",
            description: "Can I check in at 10pm instead of 2pm?",
            status: "Open" as "Open",
            created_At: null,
            updated_At: null
                }
            ];
    
            (db.query.SupportTicketsTable.findMany as jest.Mock).mockResolvedValue(tickets)
    
            const result = await getAllSupportTicketsService()
            expect(result).toEqual(tickets)
            expect(db.query.SupportTicketsTable.findMany).toHaveBeenCalled()
          })
          it("should return an empty array if no tickets are found", async () => {
            (db.query.SupportTicketsTable.findMany as jest.Mock).mockResolvedValue([])

            const result = await getAllSupportTicketsService()
            expect(result).toEqual([])
            expect(db.query.SupportTicketsTable.findMany).toHaveBeenCalled()
          })


            
        
    })


    describe("getTodoByIdService", () => {
        it("should get a support ticket by id", async () => {
            const SupportTicket = {
                   ticketId: 1,
            user_Id: 1,
            subject: "Early Check-in Request",
            description: "Can I check in at 10am instead of 2pm?",
            status: "Open" as "Open",
            created_at: new Date(),
            updated_at: new Date()
            };

            (db.query.SupportTicketsTable.findFirst as jest.Mock).mockResolvedValue(SupportTicket)

            const result = await getSupportTicketByIdService(1)
            expect(result).toEqual(SupportTicket)
            expect(db.query.SupportTicketsTable.findFirst).toHaveBeenCalledWith({
                where: expect.any(Object)
            })
        })

        it("should return null if no support ticket is found", async () => {
            (db.query.SupportTicketsTable.findFirst as jest.Mock).mockResolvedValue(null)

            const result = await getSupportTicketByIdService(999)
            expect(result).toBeNull()
            expect(db.query.SupportTicketsTable.findFirst).toHaveBeenCalledWith({
                where: expect.any(Object)
            })
        
    })

  })


describe("Update support ticket service", () => {
   it("should update a SupportTicket by id", async () => {

    const whereMock = jest.fn().mockResolvedValue(undefined);
    const setMock = jest.fn().mockReturnValue({ where: whereMock });
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    const result = await updateSupportTicketService(1, {
            ticket_id: 1,
            user_id: 1,
            subject: "Early Check-in Request",
            description: "Can I check in at 10am instead of 2pm?",
            status: "Open" as "Open",
            created_at: new Date(),
            updated_at: new Date()
    });

    expect(result).toEqual("Support ticket updated successfully");
    expect(db.update).toHaveBeenCalledWith(SupportTicketsTable);
    expect(setMock).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
   })
    
  })

  describe("Delete support ticket service", () => {
    it("should delete a SupportTicket by id", async () => {
    const whereMock = jest.fn().mockResolvedValue(undefined);
    const deleteMock = jest.fn().mockReturnValue({ where: whereMock });

    (db.delete as jest.Mock) = deleteMock;

    const result = await deleteSupportTicketService(1);

    expect(result).toEqual("Support ticket deleted successfully");
    expect(deleteMock).toHaveBeenCalledWith(SupportTicketsTable);
    expect(whereMock).toHaveBeenCalled();
});

  })



})