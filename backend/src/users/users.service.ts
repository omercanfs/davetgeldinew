import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Kendi Prisma yoluna göre ayarla

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Tüm kullanıcıları, davetiyeleriyle birlikte en yenisi en üstte olacak şekilde getir
    return this.prisma.user.findMany({
      include: {
        invitations: true, 
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}