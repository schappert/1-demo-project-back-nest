import { Controller, Post, Body, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /authentication/login  { username, password }
  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Get('test')
  testRoute() {
    return 'Hello test auth !'
  }

}
