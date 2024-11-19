import { Jwt } from './../../node_modules/@types/jsonwebtoken/index.d';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

dotenv.config();
@Module({
    imports:[PassportModule,
    JwtModule.register({
        secret:process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
    })],
    controllers:[AuthController],
    providers:[AuthService]
    
    
})
export class AuthModule {}
