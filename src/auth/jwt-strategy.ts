import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { payloadInterface } from './payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: payloadInterface) {
    const user = await this.userRepository.findOneBy([
      {
        username: payload.username,
      },
      { email: payload.email },
    ]);

    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}
