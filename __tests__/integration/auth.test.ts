import  request  from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../../src/index"
import { UsersTable } from "../../src/Drizzle/schema";
import { db } from "../../src/Drizzle/db";
import { eq } from "drizzle-orm";


let testUser = {
    first_name: "Test",
    last_name: "User",
    email: "testuser@example.com",
    password: "password"
};


beforeAll(async () => {
    // Hash the password 
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await db.insert(UsersTable).values({ ...testUser, password: hashedPassword });
});


afterAll(async () => {
    // Clean up the test user
    await db.delete(UsersTable).where(UsersTable.email.eq(testUser.email));
    await db.$client.end();
});


describe("post /auth/login", () =