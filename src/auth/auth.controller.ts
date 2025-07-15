import { createUserService } from "./auth.service";
import { Request, Response } from "express";
import bycrypt from 'bcryptjs'

//create a user controller

export const createUserController = async(req: Request, res: Response) => {
    try {

        const user  = req.body;
        console.log(user)
        const password = user.password;
        const hashedPassword = await bycrypt.hashSync(password, 10)
        user.password = hashedPassword 


        await createUserService(user)
        return res.status(201).json({ message: "User created successfully" })


        
    } catch (error: any) {
                return res.status(500).json({error: error.message})
            }
        }