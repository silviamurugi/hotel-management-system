import { sql } from "drizzle-orm"
import db from "../Drizzle/db"
import { TIUser, UsersTable } from "../Drizzle/schema"

//creating a user

export const createUserService = async (user: TIUser) => {
    await db.insert(UsersTable).values(user)
    return "User created successfully"
}

//Login user

export const userLoginService = async(user: TIUser) => {
    //email used to confirm existence of a user in the db
    const { email } = user

    return await db.query.UsersTable.findFirst({
        columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            password_hash: true
        }, where: sql`${UsersTable.email} = ${email}`
    })
    
}