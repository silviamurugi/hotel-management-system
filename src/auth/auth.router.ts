// routing
import { Express } from "express";
import {
    createUserController
} from "./auth.controller";


const user = (app: Express) => {
    // route
    app.route("/auth/register").post(
        async (req, res, next) => {
            try {
                await createUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // verify user route
    

    // login route


    // get all users route
 
}

export default user;