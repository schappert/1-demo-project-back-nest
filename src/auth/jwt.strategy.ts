import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev_jwt_secret',
    });
  }

  // payload = { username, sub }
  async validate(payload: any) {
    // Optionnel : récupérer l'utilisateur complet depuis la BDD
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) return null;
    const { password, ...rest } = user as any;
    return rest; // sera disponible dans req.user
  }
}
