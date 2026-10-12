import { Injectable } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  create(createGuestDto: CreateGuestDto) {
    return this.prisma.guest.create({
      data: {
        firstName: createGuestDto.firstName,
        lastName: createGuestDto.lastName,
        phoneNumber: createGuestDto.phoneNumber,
        guestCount: createGuestDto.guestCount || 1,
        message: createGuestDto.message,
        invitationId: createGuestDto.invitationId,
      },
    });
  }

  // Artık boolean (true/false) değil, PENDING, ATTENDING, DECLINED durumlarını tutuyoruz
  updateAttendance(id: number, attendance: 'PENDING' | 'ATTENDING' | 'DECLINED') {
    return this.prisma.guest.update({
      where: { id },
      data: { attendance: attendance as any },
    });
  }

  remove(id: number) {
    return this.prisma.guest.delete({
      where: { id },
    });
  }
}