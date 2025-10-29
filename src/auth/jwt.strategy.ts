import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.['access_token'] || null;
      },
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'access_secret_dev',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) throw new UnauthorizedException();
    const { password, ...result } = user;
    return result;
  }
}
