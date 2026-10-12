import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: 'davetgeldi-cok-gizli-sir-2026', // Gerçek projede .env içine alınır
      signOptions: { expiresIn: '7d' }, // Token 7 gün geçerli olsun
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}