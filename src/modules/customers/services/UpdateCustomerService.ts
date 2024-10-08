import { getCustomRepository } from "typeorm";
import Customer from "../infra/typeorm/entities/Customer";
import CustomersRepository from "../infra/typeorm/repositories/CustomersRepository";
import AppError from "../../../shared/errors/AppError";

interface IRequest{
    id: string;
    name: string;
    email: string;
}

export default class UpdateCustomerService{
    public async execute({id, name, email}: IRequest): Promise<Customer>{
        const customersRepository = getCustomRepository(CustomersRepository);
        const customer = await customersRepository.findOne(id);

        if(!customer){
            throw new AppError('Customer not found.', 404);
        }

        const emailAlreadyInUse = await customersRepository.findByEmail(email);

        if(emailAlreadyInUse && email !== customer.email){
            throw new AppError('There is already one customer with this email.', 409);
        }

        customer.name = name;
        customer.email = email;

        await customersRepository.save(customer);

        

        return customer;
    }
}