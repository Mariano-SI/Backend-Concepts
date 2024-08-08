import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import UserController from "../controller/UserController";
import isAuthenticated from "../../../shared/http/middlewares/isAuthenticated";

const usersRoutes = Router();
const usersController = new UserController();

usersRoutes.get("/", isAuthenticated,  usersController.index);
usersRoutes.post(
    "/",
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().required()
        }
    }),  
    usersController.create);

export default usersRoutes;