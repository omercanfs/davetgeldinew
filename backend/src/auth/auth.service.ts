import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, passwordHash: string, fullName: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Bu email adresi zaten kullanılıyor.');
    }

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        fullName,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
    };
  }

  async login(email: string, passwordHash: string) {
    // 1. Kullanıcıyı bul
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Geçersiz email veya şifre.');
    }

    // 2. Şifreyi doğrula
    const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz email veya şifre.');
    }

    // 3. Token oluştur ve rolü (ADMIN / USER) pakete ekleyip gönder
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role // KRİTİK: Veritabanındaki gerçek rol buraya basılıyor!
      }
    };
  }
}