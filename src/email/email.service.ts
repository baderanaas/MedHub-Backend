import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) {

    }
    emailTransport(){
    const transporter = nodemailer.createTransport({
            host:this.configService.get<string>('Email_Host') ,
            port: this.configService.get<number>('Email_Port'),
            secure: false , 
            auth:{
                user:this.configService.get<string>('Email_User'),
                pass: this.configService.get<string>('Email_PASSWORD'),
            }
        });
        return transporter;
    }

    async sendEmail(dto: sendEmailDto): Promise<void> {
        const {recipients, subject, html}= dto;
        const transporter = this.emailTransport();
        const options: nodemailer.SendMailOptions = {
            from : this.configService.get<string>('Email_USER'),
            to : recipients,
            subject: subject,
            html: html,
        };
        try {
            await transporter.sendMail(options);
            console.log('Email sent successfully')
        }catch (error) {
            console.error('Error sending email',error);
        }
    }

}
