import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import CustomersController from "../controller/CustomersController";
import isAuthenticated from "../../../../../shared/infra/http/middlewares/isAuthenticated";

const customersRoutes = Router();

const customersController = new CustomersController();

customersRoutes.get("/", customersController.index);

customersRoutes.use(isAuthenticated);
customersRoutes.get(
    "/:id",
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }), 
    customersController.listById);

customersRoutes.post(
    "/",
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required()
        },
    }),
    customersController.create);

customersRoutes.put(
    "/:id",
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
        }
    }),
    customersController.update);

customersRoutes.delete(
    "/:id",
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }), 
    customersController.delete);

export default customersRoutes;