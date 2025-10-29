import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access_secret_dev',
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_dev',
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_dev',
      });

      const user = await this.usersService.findOneById(payload.sub);
      if (!user) throw new UnauthorizedException();

      const access_token = await this.jwtService.signAsync(
        { username: user.username, sub: user.id },
        {
          secret: process.env.JWT_ACCESS_SECRET || 'access_secret_dev',
          expiresIn: '15m',
        },
      );

      const new_refresh_token = await this.jwtService.signAsync(
        { username: user.username, sub: user.id },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_dev',
          expiresIn: '7d',
        },
      );

      return { access_token, refresh_token: new_refresh_token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
