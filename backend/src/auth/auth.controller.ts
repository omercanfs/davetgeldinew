import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: { email: string; passwordHash: string; fullName: string }) {
    return this.authService.register(body.email, body.passwordHash, body.fullName);
  }

  @Post('login')
  login(@Body() body: { email: string; passwordHash: string }) {
    // Tüm yükü ve veritabanı kontrolünü AuthService'e devrediyoruz!
    return this.authService.login(body.email, body.passwordHash);
  }
}