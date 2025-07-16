// Database
import { sql } from "drizzle-orm";
import db from "../Drizzle/db";
import { TIUser, UsersTable } from "../Drizzle/schema";

export const createUserService = async (user: TIUser) => {
    await db.insert(UsersTable).values(user)
    return "User created successfully";
}

export const getUserByEmailService = async (email: string) => {
    return await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${email}`
    });
};

export const verifyUserService = async (email: string) => {
    await db.update(UsersTable)
        .set({ is_verified: true, verificationCode: null })
        .where(sql`${UsersTable.email} = ${email}`);
}


//login a user
export const userLoginService = async (user: TIUser) => {
    // email and password
    const { email } = user;

    return await db.query.UsersTable.findFirst({
        columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            password_hash: true,
            role: true
        }, where: sql`${UsersTable.email} = ${email} `
    });
}