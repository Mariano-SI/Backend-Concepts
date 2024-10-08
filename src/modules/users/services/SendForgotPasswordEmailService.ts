import { getCustomRepository } from "typeorm";
import UsersRepository from "../infra/typeorm/repositories/UsersRepository";
import AppError from "../../../shared/errors/AppError";
import UserTokensRepository from "../infra/typeorm/repositories/UserTokensRepository";
import EtherealMail from "../../../config/mail/EtherealMail";
import SESMail from "../../../config/mail/SESMail";
import mailConfig from "../../../config/mail/mail"
import path from "path";


interface IRequest{
    email: string;
}

class SendForgotPasswordEmailService{
    public async execute({email}: IRequest): Promise<void>{
        const usersRepository = getCustomRepository(UsersRepository);
        const userTokenRepository = getCustomRepository(UserTokensRepository);

        const user = await usersRepository.findByEmail(email);

        if(!user){
            throw new AppError('User does not exist.', 404);
        }
        

        const token = await userTokenRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(__dirname, '..', 'mailTemplates', 'forgotPassword.hbs');

        if(mailConfig.driver === 'ses'){
            await SESMail.sendMail({
                to:{
                    name: user.name,
                    email: user.email
                },
                subject: '[API Vendas] Recuperação de senha',
                templateData:{
                    file: forgotPasswordTemplate,
                    variables:{
                        name: user.name,
                        link: `http://localhost:3000/reset_password?token=${token.token}`
                    }
                }
            });
            return;
        }
        
        await EtherealMail.sendMail({
            to:{
                name: user.name,
                email: user.email
            },
            subject: '[API Vendas] Recuperação de senha',
            templateData:{
                file: forgotPasswordTemplate,
                variables:{
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token.token}`
                }
            }
        });

        //console.log(token)


    }
}

export default SendForgotPasswordEmailService;